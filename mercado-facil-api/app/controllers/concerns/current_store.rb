# frozen_string_literal: true

module CurrentStore
  extend ActiveSupport::Concern

  def current_store
    @current_store ||= current_user&.store
  end
end
