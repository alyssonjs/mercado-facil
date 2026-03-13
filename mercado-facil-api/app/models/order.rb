# frozen_string_literal: true

class Order < ApplicationRecord
  belongs_to :store
  belongs_to :customer
  belongs_to :created_by, class_name: "User", optional: true
  has_many :order_items, dependent: :destroy
  has_one :delivery, dependent: :destroy

  validates :source, inclusion: { in: %w[admin marketplace] }
  validates :status, inclusion: { in: %w[pendente confirmado em_separacao pronto_entrega saiu_entrega entregue cancelado] }
  validates :payment_method, presence: true
  validates :subtotal_cents, :total_cents, numericality: { greater_than_or_equal_to: 0 }
  validates :delivery_fee_cents, numericality: { greater_than_or_equal_to: 0 }

  scope :today, -> { where("ordered_at >= ? OR created_at >= ?", Time.current.beginning_of_day, Time.current.beginning_of_day) }
  scope :not_canceled, -> { where.not(status: "cancelado") }

  def update_totals!
    subtotal = order_items.sum(:total_price_cents)
    self.subtotal_cents = subtotal
    self.total_cents = subtotal + delivery_fee_cents
    self.ordered_at ||= Time.current
    save!
  end
end
