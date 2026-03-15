# frozen_string_literal: true

class StoreSetting < ApplicationRecord
  belongs_to :store
  validates :store_id, uniqueness: true
end
