
# Clear existing data
ApiProject.destroy_all

# Create API Projects
api_projects = ApiProject.create!([
  {
    title: "Customer Management API",
    base_url: "https://api.techinnovations.com/customers",
    description: "API for managing customer data and interactions",
    organization: @organizations.first,
    public_id: SecureRandom.uuid
  },
  {
    title: "Payment Processing API",
    base_url: "https://api.globalsolutions.com/payments",
    description: "Secure payment processing and transaction management",
    organization: @organizations.last,
    public_id: SecureRandom.uuid
  }
])

# Make api_projects available for other seed files
@api_projects = api_projects
