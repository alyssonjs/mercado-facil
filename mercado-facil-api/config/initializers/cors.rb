# Be sure to restart your server when you modify this file.
# Allow frontend (Vercel) to call the API. Set CORS_ORIGIN in production (e.g. https://your-app.vercel.app).
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("CORS_ORIGIN", "http://localhost:5173").split(",").map(&:strip)
    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
