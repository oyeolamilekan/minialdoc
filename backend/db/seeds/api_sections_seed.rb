# Clear existing data
ApiSection.destroy_all

# Create API Sections
api_sections = ApiSection.create!([
  {
    project: @api_projects.first,
    title: "User Profiles",
    public_id: SecureRandom.uuid,
    slug: "user-profiles"
  },
  {
    project: @api_projects.first,
    title: "Customer Support",
    public_id: SecureRandom.uuid,
    slug: "customer-support"
  },
  {
    project: @api_projects.last,
    title: "Transaction Processing",
    public_id: SecureRandom.uuid,
    slug: "transaction-processing"
  }
])

# Make api_sections available for other seed files
@api_sections = api_sections
