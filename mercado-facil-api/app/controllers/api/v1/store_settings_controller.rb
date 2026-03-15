# frozen_string_literal: true

module Api
  module V1
    class StoreSettingsController < ApplicationController
      def show
        settings = current_store.store_setting || current_store.build_store_setting
        render json: store_setting_json(settings)
      end

      def update
        settings = current_store.store_setting || current_store.create_store_setting!
        if settings.update(store_setting_params)
          render json: store_setting_json(settings)
        else
          render json: { errors: settings.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def store_setting_params
        params.permit(:logo_url, :banner_url, :primary_color, :minimum_order_cents, :default_delivery_fee_cents,
          :delivery_time_minutes, :accepts_cash, :accepts_pix, :accepts_card_on_delivery, :opening_hours, :closing_hours, :active)
      end

      def store_setting_json(s)
        return nil unless s
        { id: s.id, store_id: s.store_id, logo_url: s.logo_url, banner_url: s.banner_url, primary_color: s.primary_color,
          minimum_order_cents: s.minimum_order_cents, default_delivery_fee_cents: s.default_delivery_fee_cents,
          delivery_time_minutes: s.delivery_time_minutes, accepts_cash: s.accepts_cash, accepts_pix: s.accepts_pix,
          accepts_card_on_delivery: s.accepts_card_on_delivery, opening_hours: s.opening_hours, closing_hours: s.closing_hours, active: s.active }
      end
    end
  end
end
