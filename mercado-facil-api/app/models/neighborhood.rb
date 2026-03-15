# frozen_string_literal: true

class Neighborhood < ApplicationRecord
  belongs_to :store
  validates :name, presence: true
  validates :name, uniqueness: { scope: :store_id }
end
