# frozen_string_literal: true

class StockMovement < ApplicationRecord
  belongs_to :store
  belongs_to :product

  validates :movement_type, inclusion: { in: %w[entrada saida ajuste] }
  validates :quantity, numericality: { other_than: 0 }
end
