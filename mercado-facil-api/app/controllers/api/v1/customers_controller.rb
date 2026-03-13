# frozen_string_literal: true

module Api
  module V1
    class CustomersController < ApplicationController
      def index
        customers = current_store.customers
        customers = customers.where("name ILIKE ? OR phone LIKE ?", "%#{params[:q]}%", "%#{params[:q]}%") if params[:q].present?
        render json: customers.map { |c| customer_json(c) }
      end

      def show
        c = current_store.customers.find(params[:id])
        render json: customer_json(c).merge(orders: c.orders.order(created_at: :desc).limit(10).map { |o| order_summary_json(o) })
      end

      def create
        c = current_store.customers.build(customer_params)
        if c.save
          render json: customer_json(c), status: :created
        else
          render json: { errors: c.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        c = current_store.customers.find(params[:id])
        if c.update(customer_params)
          render json: customer_json(c)
        else
          render json: { errors: c.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def customer_params
        params.permit(:name, :phone, :email, :address_line, :neighborhood, :city, :state, :zip_code, :complement, :notes, :reference_note)
      end

      def customer_json(c)
        { id: c.id, name: c.name, phone: c.phone, email: c.email, address_line: c.address_line, neighborhood: c.neighborhood,
          city: c.city, state: c.state, zip_code: c.zip_code, complement: c.complement, notes: c.notes, total_orders: c.orders.count }
      end

      def order_summary_json(o)
        { id: o.id, status: o.status, total_cents: o.total_cents, created_at: o.created_at }
      end
    end
  end
end
