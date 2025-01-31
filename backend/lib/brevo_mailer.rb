class BrevoMailer
  def initialize(settings)
    @api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
  end

  def deliver!(mail)
    begin
      to = mail.to.map { |email| { email: email } }
      html_content = mail.html_part&.body&.raw_source || mail.body.raw_source
      text_content = mail.text_part&.body&.raw_source
      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new
      send_smtp_email.sender = { email: mail.from.first }
      send_smtp_email.to = to
      send_smtp_email.subject = mail.subject
      send_smtp_email.html_content = html_content
      send_smtp_email.text_content = text_content
      result = @api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "Email sent via Brevo. Message ID: #{result.message_id}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error("Error when sending email: #{e.message}")
      Rails.logger.error("Response body: #{e.response_body}")
      Rails.logger.error("Backtrace:\n\t#{e.backtrace.join("\n\t")}")
      raise e
    rescue => e
      Rails.logger.error("Brevo error: #{e}")
      Rails.logger.error("Backtrace: #{e}")
    end
  end
end
