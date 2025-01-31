# Clear existing data
ApiEndpoint.destroy_all

# Create API Endpoints
ApiEndpoint.create!([
  {
    project: @api_projects.first,
    section: @api_sections[0],
    title: "Get User Profile",
    public_id: SecureRandom.uuid,
    body: {
      method: "GET",
      path: "/users/{id}",
      description: "Retrieve detailed user profile information",
      parameters: [
        { name: "id", type: "string", required: true, description: "Unique user identifier" }
      ],
      sampleResponses: [
        {
          status: 200,
          body: {
            id: "user123",
            name: "John Doe",
            email: "john.doe@example.com"
          }
        }
      ]
    }
  },
  {
    project: @api_projects.first,
    section: @api_sections[1],
    title: "Create Support Ticket",
    public_id: SecureRandom.uuid,
    body: {
      method: "POST",
      path: "/support/tickets",
      description: "Create a new customer support ticket",
      requestBody: [
        { name: "title", type: "string", required: true },
        { name: "description", type: "string", required: true }
      ],
      sampleResponses: [
        {
          status: 201,
          body: {
            id: "ticket456",
            title: "API Integration Issue",
            status: "open"
          }
        }
      ]
    }
  }
])
