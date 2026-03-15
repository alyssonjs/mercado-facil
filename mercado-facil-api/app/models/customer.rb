# frozen_string_literal: true

class Customer < ApplicationRecord
  belongs_to :store
  has_many :orders, dependent: :restrict_with_error

  validates :name, presence: true
  validates :phone, presence: true
  validates :address_line, presence: true
  validates :neighborhood, presence: true
end
