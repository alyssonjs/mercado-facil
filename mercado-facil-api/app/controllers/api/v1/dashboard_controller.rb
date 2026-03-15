# frozen_string_literal: true

module Api
  module V1
    class DashboardController < ApplicationController
      def show
        store = current_store
        today_orders = store.orders.today.not_canceled
        delivered_today = today_orders.where(status: "entregue")
        revenue = delivered_today.sum(:total_cents)
        pending = store.orders.where(status: "pendente").count
        deliveries_active = store.deliveries.where(status: ["atribuida", "saiu_entrega"]).count
        low_stock = store.products.where("minimum_stock_alert > 0 AND stock_quantity <= minimum_stock_alert").count

        render json: {
          orders_today: today_orders.count,
          revenue_today_cents: revenue,
          ticket_medium_cents: delivered_today.any? ? (revenue / delivered_today.count) : 0,
          pending_orders: pending,
          deliveries_in_progress: deliveries_active,
          low_stock_products: low_stock
        }
      end
    end
  end
end
