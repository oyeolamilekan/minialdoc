require 'sib-api-v3-sdk'
require_relative '../../lib/brevo_mailer'

ActionMailer::Base.add_delivery_method :brevo, BrevoMailer