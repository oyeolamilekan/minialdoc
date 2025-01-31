# config/initializers/brevo.rb

require 'sib-api-v3-sdk'

# Configure API key authorization: api-key
SibApiV3Sdk.configure do |config|
  config.api_key['api-key'] = ENV['BREVO_API_KEY'] # Your Brevo API key
end
