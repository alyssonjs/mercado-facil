# frozen_string_literal: true

class User < ApplicationRecord
  belongs_to :store
  has_secure_password

  has_many :created_orders, class_name: "Order", foreign_key: :created_by_id, dependent: :nullify
  has_many :deliveries_as_driver, class_name: "Delivery", foreign_key: :delivery_user_id, dependent: :nullify

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { scope: :store_id }
  validates :password, length: { minimum: 6 }, if: -> { password.present? }
  validates :role, inclusion: { in: %w[admin attendant delivery] }

  def admin?
    role == "admin"
  end

  def attendant?
    role == "attendant" || role == "admin"
  end

  def delivery?
    role == "delivery" || role == "admin"
  end
end
