# frozen_string_literal: true

class Product < ApplicationRecord
  belongs_to :store
  belongs_to :category, optional: true
  has_many :order_items, dependent: :restrict_with_error
  has_many :stock_movements, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: { scope: :store_id }
  validates :price_cents, numericality: { greater_than_or_equal_to: 0 }
  validates :stock_quantity, numericality: { greater_than_or_equal_to: 0 }
  validates :sale_type, inclusion: { in: %w[unit weight] }
  validates :unit_type, presence: true

  before_validation :generate_slug, on: :create
  def generate_slug
    self.slug ||= name.parameterize if name.present?
  end

  def in_stock?
    stock_quantity.positive?
  end

  def low_stock?
    minimum_stock_alert.positive? && stock_quantity <= minimum_stock_alert
  end
end
