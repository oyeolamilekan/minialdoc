module Slugify
  extend ActiveSupport::Concern

  included do
    before_save :set_slug, if: :should_generate_slug?
    validates :slug, uniqueness: true, allow_nil: true
  end

  private

  def set_slug
    self.slug = generate_unique_slug
  end

  def generate_unique_slug
    base_slug = slugify(title)
    unique_slug = base_slug
    counter = 0

    # Keep checking until we find a unique slug
    while self.class.where.not(id: id).exists?(slug: unique_slug)
      counter += 1
      unique_slug = "#{base_slug}-#{counter}"
    end

    unique_slug
  end

  def slugify(string)
    return nil if string.blank?

    # Convert to ASCII
    result = ActiveSupport::Inflector.transliterate(string.to_s)

    # Replace any non-word character with a hyphen
    result.gsub!(/[^\w\s-]/, "")

    # Replace whitespace with hyphen
    result.gsub!(/[-\s]+/, "-")

    # Remove leading/trailing hyphens
    result.gsub!(/(^-+|-+$)/, "")

    # Ensure lowercase
    result.downcase
  end

  def should_generate_slug?
    slug.blank? || title_changed?
  end

  # Optional method to regenerate slug
  def regenerate_slug!
    return unless title.present?
    update_column(:slug, generate_unique_slug)
  end
end
