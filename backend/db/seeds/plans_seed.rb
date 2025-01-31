# Seed data for plans
Plan.destroy_all

plans = Plan.create!(
  [
    {
      name: "Basic Plan",
      description: "Perfect for individuals starting out.",
      price: 9.99,
      interval: "month",
      features: {
        storage: "10GB",
        support: "Email support",
        users: 1
      }
    },
    {
      name: "Pro Plan",
      description: "Great for small teams and professionals.",
      price: 29.99,
      interval: "month",
      features: {
        storage: "50GB",
        support: "Priority email support",
        users: 5
      }
    },
    {
      name: "Business Plan",
      description: "Ideal for growing businesses.",
      price: 99.99,
      interval: "month",
      features: {
        storage: "200GB",
        support: "24/7 phone support",
        users: "Unlimited"
      }
    }
  ]
)

puts "Seeded #{Plan.count} plans."

@plans = plans
