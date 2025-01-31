# Main seed file to orchestrate seeding

# Require individual seed files
require_relative 'seeds/organizations_seed.rb'
require_relative 'seeds/users_seed.rb'
require_relative 'seeds/api_projects_seed.rb'
require_relative 'seeds/api_sections_seed.rb'
require_relative 'seeds/api_endpoints_seed.rb'
require_relative 'seeds/plans_seed.rb'

puts "Seed data creation completed successfully!"
