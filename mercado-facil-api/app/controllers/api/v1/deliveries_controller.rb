# frozen_string_literal: true

module Api
  module V1
    class DeliveriesController < ApplicationController
      def index
        deliveries = current_store.deliveries.includes(:order, :delivery_user).order(created_at: :desc)
        deliveries = deliveries.where(status: params[:status]) if params[:status].present?
        render json: deliveries.map { |d| delivery_json(d) }
      end

      def create
        d = current_store.deliveries.build(delivery_params)
        d.assigned_at = Time.current if d.delivery_user_id.present?
        if d.save
          render json: delivery_json(d), status: :created
        else
          render json: { errors: d.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        d = current_store.deliveries.find(params[:id])
        if d.update(delivery_params)
          render json: delivery_json(d)
        else
          render json: { errors: d.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def change_status
        d = current_store.deliveries.find(params[:id])
        d.update!(status: params[:status])
        d.update!(left_for_delivery_at: Time.current) if params[:status] == "saiu_entrega"
        d.update!(delivered_at: Time.current) if params[:status] == "entregue"
        d.order.update!(status: "entregue", delivered_at: Time.current) if params[:status] == "entregue"
        render json: delivery_json(d)
      end

      private

      def delivery_params
        params.permit(:order_id, :delivery_user_id, :status, :notes)
      end

      def delivery_json(d)
        { id: d.id, order_id: d.order_id, customer_name: d.order.customer.name, address: d.order.delivery_address_snapshot&.dig("address") || d.order.customer.address_line,
          neighborhood: d.order.neighborhood_snapshot || d.order.customer.neighborhood, delivery_user_id: d.delivery_user_id,
          delivery_user_name: d.delivery_user&.name, status: d.status, assigned_at: d.assigned_at, left_for_delivery_at: d.left_for_delivery_at,
          delivered_at: d.delivered_at, notes: d.notes }
      end
    end
  end
end
