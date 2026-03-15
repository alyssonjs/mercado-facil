# frozen_string_literal: true

module JwtAuthenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request!, unless: :skip_jwt_auth?
  end

  def skip_jwt_auth?
    false
  end

  attr_reader :current_user

  private

  def authenticate_request!
    token = request.headers["Authorization"]&.split(" ")&.last
    unless token
      render json: { error: "Unauthorized" }, status: :unauthorized
      return
    end
    payload = decode_jwt(token)
    unless payload
      render json: { error: "Invalid or expired token" }, status: :unauthorized
      return
    end
    @current_user = User.find_by(id: payload["user_id"])
    unless @current_user&.active?
      render json: { error: "User not found or inactive" }, status: :unauthorized
    end
  end

  def decode_jwt(token)
    secret = ENV["JWT_SECRET_KEY"].presence || Rails.application.secret_key_base
    JWT.decode(token, secret, true, { algorithm: "HS256" })[0]
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end
end
