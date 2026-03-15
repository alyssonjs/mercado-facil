# frozen_string_literal: true

module Api
  module V1
    class OrdersController < ApplicationController
      def index
        orders = current_store.orders.includes(:customer, :order_items).order(created_at: :desc)
        orders = orders.where(status: params[:status]) if params[:status].present?
        render json: orders.map { |o| order_json(o) }
      end

      def show
        o = current_store.orders.find(params[:id])
        render json: order_json(o).merge(items: o.order_items.map { |i| order_item_json(i) })
      end

      def create
        order = current_store.orders.build(order_params)
        order.created_by_id = current_user.id
        if order.save
          create_order_items(order, params[:items])
          order.update_totals!
          render json: order_json(order).merge(items: order.order_items.map { |i| order_item_json(i) }), status: :created
        else
          render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        o = current_store.orders.find(params[:id])
        if o.update(order_update_params)
          render json: order_json(o)
        else
          render json: { errors: o.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def confirm
        o = current_store.orders.find(params[:id])
        o.update!(status: "confirmado", confirmed_at: Time.current)
        o.order_items.each { |item| item.product.update_column(:stock_quantity, item.product.stock_quantity - item.quantity.to_i) }
        render json: order_json(o)
      end

      def cancel
        o = current_store.orders.find(params[:id])
        o.update!(status: "cancelado", canceled_at: Time.current)
        # Restore stock if was confirmed
        if o.confirmed_at.present?
          o.order_items.each { |item| item.product.update_column(:stock_quantity, item.product.stock_quantity + item.quantity.to_i) }
        end
        render json: order_json(o)
      end

      def change_status
        o = current_store.orders.find(params[:id])
        o.update!(status: params[:status])
        render json: order_json(o)
      end

      private

      def order_params
        params.permit(:customer_id, :source, :payment_method, :delivery_fee_cents, :change_for_cents, :notes, :neighborhood_snapshot, delivery_address_snapshot: {})
      end

      def order_update_params
        params.permit(:status, :payment_method, :notes)
      end

      def create_order_items(order, items)
        return unless items.is_a?(Array)
        items.each do |item|
          product = current_store.products.find(item["product_id"])
          order.order_items.create!(
            product_id: product.id,
            product_name_snapshot: product.name,
            unit_type: product.unit_type,
            quantity: item["quantity"].to_d,
            unit_price_cents: product.price_cents,
            total_price_cents: (product.price_cents * item["quantity"].to_d).round
          )
        end
      end

      def order_json(o)
        { id: o.id, customer_id: o.customer_id, customer_name: o.customer.name, source: o.source, status: o.status,
          payment_method: o.payment_method, subtotal_cents: o.subtotal_cents, delivery_fee_cents: o.delivery_fee_cents,
          total_cents: o.total_cents, change_for_cents: o.change_for_cents, notes: o.notes,
          neighborhood_snapshot: o.neighborhood_snapshot, ordered_at: o.ordered_at, confirmed_at: o.confirmed_at,
          delivered_at: o.delivered_at, created_at: o.created_at }
      end

      def order_item_json(i)
        { id: i.id, product_id: i.product_id, product_name_snapshot: i.product_name_snapshot, unit_type: i.unit_type,
          quantity: i.quantity, unit_price_cents: i.unit_price_cents, total_price_cents: i.total_price_cents }
      end
    end
  end
end
