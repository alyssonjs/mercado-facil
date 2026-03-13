# frozen_string_literal: true

module Api
  module V1
    class InventoryController < ApplicationController
      def index
        products = current_store.products.includes(:category).order(:name)
        render json: products.map { |p| product_stock_json(p) }
      end

      def adjustments
        product = current_store.products.find(params[:product_id])
        qty = params[:quantity].to_i
        type = qty.positive? ? "entrada" : "saida"
        current_store.stock_movements.create!(product: product, movement_type: type, quantity: qty.abs, notes: params[:notes].to_s)
        product.update!(stock_quantity: product.stock_quantity + qty)
        render json: product_stock_json(product)
      end

      def movements
        movements = current_store.stock_movements.includes(:product).order(created_at: :desc).limit(100)
        movements = movements.where(product_id: params[:product_id]) if params[:product_id].present?
        render json: movements.map { |m| { id: m.id, product_id: m.product_id, product_name: m.product.name, movement_type: m.movement_type, quantity: m.quantity, notes: m.notes, created_at: m.created_at } }
      end

      private

      def product_stock_json(p)
        { id: p.id, name: p.name, slug: p.slug, stock_quantity: p.stock_quantity, minimum_stock_alert: p.minimum_stock_alert, low_stock: p.low_stock? }
      end
    end
  end
end
