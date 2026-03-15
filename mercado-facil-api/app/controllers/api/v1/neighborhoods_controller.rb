# frozen_string_literal: true

module Api
  module V1
    class NeighborhoodsController < ApplicationController
      def index
        render json: current_store.neighborhoods.map { |n| neighborhood_json(n) }
      end

      def create
        n = current_store.neighborhoods.build(neighborhood_params)
        if n.save
          render json: neighborhood_json(n), status: :created
        else
          render json: { errors: n.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        n = current_store.neighborhoods.find(params[:id])
        if n.update(neighborhood_params)
          render json: neighborhood_json(n)
        else
          render json: { errors: n.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        n = current_store.neighborhoods.find(params[:id])
        n.destroy!
        head :no_content
      end

      private

      def neighborhood_params
        params.permit(:name, :delivery_fee_cents, :active)
      end

      def neighborhood_json(n)
        { id: n.id, name: n.name, delivery_fee_cents: n.delivery_fee_cents, active: n.active }
      end
    end
  end
end
