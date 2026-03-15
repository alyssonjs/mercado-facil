# frozen_string_literal: true

class Store < ApplicationRecord
  has_one :store_setting, dependent: :destroy
  has_many :users, dependent: :restrict_with_error
  has_many :neighborhoods, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :products, dependent: :destroy
  has_many :customers, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :deliveries, dependent: :destroy
  has_many :stock_movements, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :slug, format: { with: /\A[a-z0-9\-]+\z/, message: "only allows letters, numbers and hyphens" }
end
