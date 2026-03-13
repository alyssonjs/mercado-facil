# frozen_string_literal: true

module Api
  module V1
    class AuthController < ApplicationController
      include JwtAuthenticatable
      include CurrentStore

      def skip_jwt_auth?
        action_name == "login"
      end

      def login
        user = User.where(email: params[:email]).find { |u| u.authenticate(params[:password]) }
        if user
          if user.active?
            token = encode_jwt(user)
            render json: { token: token, user: user_json(user), store: store_json(user.store) }
          else
            render json: { error: "Account is inactive" }, status: :unauthorized
          end
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def me
        render json: { user: user_json(current_user), store: store_json(current_store) }
      end

      def logout
        head :ok
      end

      private

      def encode_jwt(user)
        secret = ENV["JWT_SECRET_KEY"].presence || Rails.application.secret_key_base
        payload = { user_id: user.id, store_id: user.store_id, exp: 7.days.from_now.to_i }
        JWT.encode(payload, secret, "HS256")
      end

      def user_json(user)
        { id: user.id, name: user.name, email: user.email, role: user.role, store_id: user.store_id }
      end

      def store_json(store)
        return nil unless store
        { id: store.id, name: store.name, slug: store.slug }
      end
    end
  end
end
