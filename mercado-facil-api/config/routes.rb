# frozen_string_literal: true

Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post "auth/login", to: "auth#login"
      get "auth/me", to: "auth#me"
      post "auth/logout", to: "auth#logout"

      get "dashboard", to: "dashboard#show"

      get "store", to: "stores#show"
      patch "store", to: "stores#update"
      get "store-settings", to: "store_settings#show"
      patch "store-settings", to: "store_settings#update"

      resources :neighborhoods, only: [:index, :create, :update, :destroy]
      resources :categories, only: [:index, :create, :update, :destroy]
      resources :products, only: [:index, :create, :show, :update, :destroy]
      resources :customers, only: [:index, :create, :show, :update, :destroy]
      resources :orders, only: [:index, :create, :show, :update] do
        post :confirm, on: :member
        post :cancel, on: :member
        post :change_status, on: :member
      end
      resources :deliveries, only: [:index, :create, :update] do
        post :change_status, on: :member
      end
      get "inventory", to: "inventory#index"
      post "inventory/adjustments", to: "inventory#adjustments"
      get "inventory/movements", to: "inventory#movements"
      resources :users, only: [:index, :create, :update]

      # Public storefront (no auth)
      get "storefront/:slug", to: "storefront#show"
      get "storefront/:slug/categories", to: "storefront#categories"
      get "storefront/:slug/products", to: "storefront#products"
      get "storefront/:slug/products/:product_id", to: "storefront#product"
      post "storefront/:slug/checkout", to: "storefront#checkout"
      post "storefront/:slug/calculate-delivery", to: "storefront#calculate_delivery"

      post "tracking/order", to: "tracking#order"
    end
  end
end
