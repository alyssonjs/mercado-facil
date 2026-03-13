class ApplicationController < ActionController::API
  include JwtAuthenticatable
  include CurrentStore
end
