# frozen_string_literal: true

module Api
  module V1
    class ProductsController < ApplicationController
      def index
        products = current_store.products.includes(:category)
        products = products.where(category_id: params[:category_id]) if params[:category_id].present?
        products = products.where(active: true) if params[:active].to_s == "true"
        render json: products.map { |p| product_json(p) }
      end

      def show
        p = current_store.products.find(params[:id])
        render json: product_json(p)
      end

      def create
        p = current_store.products.build(product_params)
        if p.save
          render json: product_json(p), status: :created
        else
          render json: { errors: p.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        p = current_store.products.find(params[:id])
        if p.update(product_params)
          render json: product_json(p)
        else
          render json: { errors: p.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        p = current_store.products.find(params[:id])
        p.destroy!
        head :no_content
      end

      private

      def product_params
        params.permit(:category_id, :name, :slug, :description, :price_cents, :sale_type, :unit_type,
          :stock_quantity, :minimum_stock_alert, :active, :featured, :image_url)
      end

      def product_json(p)
        { id: p.id, store_id: p.store_id, category_id: p.category_id, name: p.name, slug: p.slug, description: p.description,
          price_cents: p.price_cents, sale_type: p.sale_type, unit_type: p.unit_type, stock_quantity: p.stock_quantity,
          minimum_stock_alert: p.minimum_stock_alert, active: p.active, featured: p.featured, image_url: p.image_url,
          category_name: p.category&.name }
      end
    end
  end
end
