# frozen_string_literal: true

module Api
  module V1
    class CategoriesController < ApplicationController
      def index
        render json: current_store.categories.map { |c| category_json(c) }
      end

      def create
        c = current_store.categories.build(category_params)
        if c.save
          render json: category_json(c), status: :created
        else
          render json: { errors: c.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        c = current_store.categories.find(params[:id])
        if c.update(category_params)
          render json: category_json(c)
        else
          render json: { errors: c.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        c = current_store.categories.find(params[:id])
        c.destroy!
        head :no_content
      end

      private

      def category_params
        params.permit(:name, :slug, :active)
      end

      def category_json(c)
        { id: c.id, name: c.name, slug: c.slug, active: c.active }
      end
    end
  end
end
