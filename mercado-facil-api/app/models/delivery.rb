# frozen_string_literal: true

class Delivery < ApplicationRecord
  belongs_to :store
  belongs_to :order
  belongs_to :delivery_user, class_name: "User", optional: true

  validates :status, inclusion: { in: %w[atribuida saiu_entrega entregue cancelada] }
end
