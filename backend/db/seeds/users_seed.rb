# Clear existing data
User.destroy_all

# Create Users
users = User.create!([
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@techinnovations.com",
    password: "secure_password_123",
    password_digest: BCrypt::Password.create("secure_password_123"),
    role: "admin",
    organization: @organizations.first,
    public_id: SecureRandom.uuid
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@globalsolutions.com",
    password: "another_secure_password",
    password_digest: BCrypt::Password.create("another_secure_password"),
    role: "member",
    organization: @organizations.last,
    public_id: SecureRandom.uuid
  }
])

# Make users available for other seed files
@users = users
