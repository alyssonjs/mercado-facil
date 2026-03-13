# frozen_string_literal: true

module Api
  module V1
    class StorefrontController < ApplicationController
      def skip_jwt_auth?
        true
      end

      def show
        store = Store.find_by!(slug: params[:slug], active: true)
        settings = store.store_setting || store.build_store_setting
        render json: {
          store: { id: store.id, name: store.name, slug: store.slug, phone: store.phone, email: store.email, address: store.address },
          settings: store_setting_public_json(settings)
        }
      end

      def categories
        store = Store.find_by!(slug: params[:slug], active: true)
        render json: store.categories.where(active: true).map { |c| { id: c.id, name: c.name, slug: c.slug } }
      end

      def products
        store = Store.find_by!(slug: params[:slug], active: true)
        products = store.products.where(active: true).includes(:category)
        products = products.where(category_id: params[:category_id]) if params[:category_id].present?
        render json: products.map { |p| product_public_json(p) }
      end

      def product
        store = Store.find_by!(slug: params[:slug], active: true)
        p = store.products.find(params[:product_id])
        render json: product_public_json(p) if p.active?
      end

      def calculate_delivery
        store = Store.find_by!(slug: params[:slug], active: true)
        neighborhood = store.neighborhoods.find_by(name: params[:neighborhood], active: true)
        fee = neighborhood ? neighborhood.delivery_fee_cents : (store.store_setting&.default_delivery_fee_cents || 0)
        render json: { delivery_fee_cents: fee }
      end

      def checkout
        store = Store.find_by!(slug: params[:slug], active: true)
        customer = store.customers.find_or_initialize_by(phone: params[:phone])
        customer.name = params[:name] if params[:name].present?
        customer.address_line = params[:address] if params[:address].present?
        customer.neighborhood = params[:neighborhood] if params[:neighborhood].present?
        customer.save!
        order = store.orders.create!(
          customer: customer,
          source: "marketplace",
          status: "pendente",
          payment_method: params[:payment_method] || "dinheiro",
          delivery_fee_cents: params[:delivery_fee_cents].to_i,
          change_for_cents: params[:change_for_cents].to_i,
          notes: params[:notes],
          delivery_address_snapshot: { address: params[:address], neighborhood: params[:neighborhood] },
          neighborhood_snapshot: params[:neighborhood],
          ordered_at: Time.current
        )
        (params[:items] || []).each do |item|
          product = store.products.find(item["product_id"])
          next unless product.active? && product.stock_quantity >= item["quantity"].to_i
          order.order_items.create!(
            product_id: product.id,
            product_name_snapshot: product.name,
            unit_type: product.unit_type,
            quantity: item["quantity"].to_d,
            unit_price_cents: product.price_cents,
            total_price_cents: (product.price_cents * item["quantity"].to_d).round
          )
        end
        order.update_totals!
        render json: { order_id: order.id, total_cents: order.total_cents, status: order.status }, status: :created
      end

      private

      def store_setting_public_json(s)
        { logo_url: s.logo_url, banner_url: s.banner_url, primary_color: s.primary_color, minimum_order_cents: s.minimum_order_cents,
          default_delivery_fee_cents: s.default_delivery_fee_cents, delivery_time_minutes: s.delivery_time_minutes,
          accepts_cash: s.accepts_cash, accepts_pix: s.accepts_pix, accepts_card_on_delivery: s.accepts_card_on_delivery,
          opening_hours: s.opening_hours, closing_hours: s.closing_hours }
      end

      def product_public_json(p)
        { id: p.id, name: p.name, slug: p.slug, description: p.description, price_cents: p.price_cents, sale_type: p.sale_type,
          unit_type: p.unit_type, stock_quantity: p.stock_quantity, featured: p.featured, image_url: p.image_url, category_name: p.category&.name }
      end
    end
  end
end
