# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('CORS_ALLOWED_ORIGINS', '').split(',').map(&:strip).map { |pattern|
      if pattern.include?('*')
        # Convert wildcard pattern to regex for matching
        domain_pattern = pattern.gsub('.', '\.').gsub('*', '[^.]+')
        Regexp.new("\\A#{domain_pattern}\\z")
      else
        pattern
      end
    }

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
