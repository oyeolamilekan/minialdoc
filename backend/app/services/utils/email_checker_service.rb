require "httparty"
require "json"

module Utils
  class EmailCheckerService < ApplicationService
    DISPOSABLE_DOMAINS_URL = "https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.json"

    attr_reader :email

    def initialize(email)
      @email = email
    end

    def call
      domain = extract_domain(email)
      disposable_domains = fetch_disposable_domains
      disposable_domains.include?(domain)
    end

    private

    def fetch_disposable_domains
      Rails.cache.fetch("disposable_email_domains", expires_in: 7.days) do
        response = HTTParty.get(DISPOSABLE_DOMAINS_URL, timeout: 10)
        JSON.parse(response.body) if response.success?
      end
    rescue StandardError => e
      Rails.logger.error "Error fetching disposable domains: #{e.message}"
      []
    end

    def extract_domain(email)
      email.split("@").last.downcase
    end
  end
end
