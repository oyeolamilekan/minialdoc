# Clear existing data
Organization.destroy_all

# Create Organizations
organizations = Organization.create!([
  {
    title: "Tech Innovations Inc.",
    public_id: SecureRandom.uuid,
    slug: "tech-innovations"
  },
  {
    title: "Global Solutions Corp",
    public_id: SecureRandom.uuid,
    slug: "global-solutions"
  }
])

# Make organizations available for other seed files
@organizations = organizations
