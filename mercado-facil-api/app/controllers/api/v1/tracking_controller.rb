# frozen_string_literal: true

module Api
  module V1
    class TrackingController < ApplicationController
      def skip_jwt_auth?
        true
      end

      def order
        order = Order.joins(:customer).find_by(id: params[:order_id])
        normalized = params[:phone].to_s.gsub(/\D/, "")
        order = nil if order && order.customer.phone.gsub(/\D/, "") != normalized
        if order
          render json: {
            order_id: order.id,
            status: order.status,
            total_cents: order.total_cents,
            created_at: order.created_at,
            items: order.order_items.map { |i| { product_name: i.product_name_snapshot, quantity: i.quantity, total_price_cents: i.total_price_cents } }
          }
        else
          render json: { error: "Pedido não encontrado" }, status: :not_found
        end
      end
    end
  end
end
