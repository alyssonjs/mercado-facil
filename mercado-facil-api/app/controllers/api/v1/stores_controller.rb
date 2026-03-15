# frozen_string_literal: true

module Api
  module V1
    class StoresController < ApplicationController
      def show
        render json: store_json(current_store)
      end

      def update
        if current_store.update(store_params)
          render json: store_json(current_store)
        else
          render json: { errors: current_store.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def store_params
        params.permit(:name, :slug, :phone, :email, :address, :active)
      end

      def store_json(store)
        return nil unless store
        { id: store.id, name: store.name, slug: store.slug, phone: store.phone, email: store.email, address: store.address, active: store.active }
      end
    end
  end
end
