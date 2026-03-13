# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      def index
        users = current_store.users.order(:name)
        render json: users.map { |u| user_json(u) }
      end

      def create
        u = current_store.users.build(user_params)
        u.password = params[:password] if params[:password].present?
        if u.save
          render json: user_json(u), status: :created
        else
          render json: { errors: u.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        u = current_store.users.find(params[:id])
        u.assign_attributes(user_params)
        u.password = params[:password] if params[:password].present?
        if u.save
          render json: user_json(u)
        else
          render json: { errors: u.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.permit(:name, :email, :role, :active)
      end

      def user_json(u)
        { id: u.id, name: u.name, email: u.email, role: u.role, active: u.active }
      end
    end
  end
end
