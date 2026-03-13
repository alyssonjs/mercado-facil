# frozen_string_literal: true

class Category < ApplicationRecord
  belongs_to :store
  has_many :products, dependent: :restrict_with_error

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: { scope: :store_id }
  validates :slug, format: { with: /\A[a-z0-9\-]+\z/, message: "only allows letters, numbers and hyphens" }

  before_validation :generate_slug, on: :create
  def generate_slug
    self.slug ||= name.parameterize if name.present?
  end
end
