# 🌟 A star would be much appreciated! 🌟

# Minialdoc
An open-source alternative to readme.com for creating beautiful API documentation. Built for developers who want a simple, free way to document their APIs with features like interactive API testing, markdown support, and team collaboration.

## 🚀 Tech Stack

### Frontend
- Next.js
- React
- [Other frontend libraries/frameworks]

### Backend
- Ruby on Rails
- PostgreSQL (or your database)
- [Other backend technologies]

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- Ruby
- Rails
- PostgreSQL
- Yarn/npm

## 🛠 Installation

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/oyeolamilekan/minialdoc.git

# Navigate to the Rails backend directory
cd minialdoc/backend

# Install Ruby dependencies
bundle install

# Setup database
rails db:create db:migrate db:seed

# Start the Rails server
rails s
```

### Frontend Setup

```bash
# Navigate to the Next.js frontend directory
cd minialdoc/frontend

# Install dependencies
yarn install # or npm install

# Start the development server
yarn dev # or npm run dev
```

## 🌐 Environment Variables

Create `.env` files in both frontend and backend directories:

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
[other frontend env variables]
```

### Backend (.env)
```
DATABASE_URL=postgresql://[your-database-url]
[other backend env variables]
```

## Database Schema

The application uses PostgreSQL and includes the following tables:

### Organizations
- `id`: bigint, primary key
- `title`: string
- `public_id`: string
- `slug`: string
- `timestamps`: created_at, updated_at

### Users
- `id`: bigint, primary key
- `first_name`: string
- `last_name`: text
- `email`: text
- `password`: text
- `password_digest`: text
- `public_id`: text
- `role`: string
- `organization_id`: bigint (foreign key)
- `timestamps`: created_at, updated_at

### API Projects
- `id`: bigint, primary key
- `title`: string
- `base_url`: string
- `description`: text
- `slug`: string
- `public_id`: uuid
- `organization_id`: bigint (foreign key)
- `timestamps`: created_at, updated_at

### API Sections
- `id`: bigint, primary key
- `project_id`: bigint (foreign key)
- `title`: string
- `slug`: string
- `public_id`: uuid
- `timestamps`: created_at, updated_at

### API Endpoints
- `id`: bigint, primary key
- `section_id`: bigint (foreign key)
- `project_id`: bigint (foreign key)
- `title`: string (limit: 250)
- `slug`: string (limit: 260)
- `public_id`: uuid
- `endpoint_type`: string (default: "endpoint")
- `content`: text
- `markdown`: text
- `body`: json (containing method, path, description, parameters, requestBody, authHeader, sampleResponses)
- `timestamps`: created_at, updated_at

### Plans
- `id`: bigint, primary key
- `public_id`: uuid
- `name`: string, not null
- `description`: text
- `recommended`: boolean (default: false)
- `price`: decimal(10,2), not null
- `interval`: string, not null
- `features`: jsonb (default: {})
- `timestamps`: created_at, updated_at

### Permissions
- `id`: bigint, primary key
- `public_id`: uuid
- `name`: string, not null
- `key`: string, not null, unique
- `description`: text
- `timestamps`: created_at, updated_at

### Plan Permissions
- `id`: bigint, primary key
- `public_id`: uuid
- `plan_id`: bigint (foreign key)
- `permission_id`: bigint (foreign key)
- `timestamps`: created_at, updated_at

### Subscriptions
- `id`: bigint, primary key
- `public_id`: uuid
- `organization_id`: bigint (foreign key)
- `plan_id`: bigint (foreign key)
- `status`: string (default: "pending")
- `stripe_subscription_id`: string, not null
- `stripe_customer_id`: string, not null
- `start_date`: datetime, not null
- `end_date`: datetime, not null
- `timestamps`: created_at, updated_at

### Key Relationships
- Users belong to Organizations
- API Projects belong to Organizations
- API Sections belong to API Projects
- API Endpoints belong to both API Sections and API Projects
- Subscriptions belong to Organizations and Plans
- Plan Permissions join Plans and Permissions

## Features

### Project Management
- Create and manage multiple API documentation projects
- Set custom base URLs for each project
- Organize API documentation with sections and endpoints
- Full CRUD operations for projects, sections, and endpoints

### API Documentation
- Document API endpoints with detailed information:
  - HTTP methods (GET, POST, PUT, DELETE)
  - Endpoint paths
  - Request parameters
  - Request body specifications
  - Authentication header configurations
  - Sample responses
- Support for markdown content in documentation
- Structured organization with sections and endpoints

### User & Organization Management
- User authentication system with signup and signin
- Organization-based access control
- Multi-user support within organizations
- Password management functionality
- Email validation with disposable email detection

### Subscription System
- Tiered subscription plans
- Stripe integration for payment processing
- Plan management with features:
  - Multiple pricing tiers
  - Different billing intervals
  - Feature-based plan differentiation
- Active subscription tracking
- Subscription status management

### Security
- JWT-based authentication
- Password encryption
- Protected API endpoints
- Role-based access control

### Additional Features
- PostgreSQL database for reliable data storage
- RESTful API architecture
- Webhook support for Stripe integration
- Health check endpoint for monitoring

## 🔨 API Endpoints

All endpoints are prefixed with `/api/v1`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create a new user account |
| POST | `/auth/signin` | Login to existing account |
| POST | `/auth/change_password` | Change user password (requires authentication) |

### Organizations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/organizations/create_organization` | Create a new organization |
| GET | `/organizations/fetch_users/:public_id` | Get all users in an organization |

### Subscriptions & Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subscriptions/plans` | List all available subscription plans |
| GET | `/subscriptions/fetch_active_subscription` | Get current active subscription |
| POST | `/subscriptions/pay_subscription/:plan_id` | Initialize payment for a subscription plan |
| POST | `/subscriptions/create/:plan_id` | Create a new subscription |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List all projects |
| POST | `/projects/create_project` | Create a new project |
| GET | `/projects/fetch_project/:slug` | Get project details |
| PUT | `/projects/update_project/:slug` | Update project details |
| DELETE | `/projects/delete_project/:slug` | Delete a project |

### Sections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sections/:project_slug` | List all sections in a project |
| POST | `/sections/create_section/:project_slug` | Create a new section |
| GET | `/sections/fetch_section_endpoints/:project_slug` | Get sections with their endpoints |
| PUT | `/sections/update_section/:section_slug` | Update section details |
| DELETE | `/sections/delete_section/:section_slug` | Delete a section |

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/endpoints/fetch_endpoint/:endpoint_slug` | Get endpoint details |
| PUT | `/endpoints/update_endpoint/:endpoint_slug` | Update endpoint details |
| POST | `/endpoints/create_endpoint/:project_slug/:section_slug` | Create a new endpoint |
| DELETE | `/endpoints/delete_endpoint/:endpoint_slug` | Delete an endpoint |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhooks/stripe` | Stripe webhook endpoint |

### Authentication
Most endpoints require authentication via a JWT token in the Authorization header:

## 🧪 Running Tests

### Backend Tests
```bash
# Run Rails tests
rspec
```

### Frontend Tests
```bash
# Run Next.js tests
yarn test # or npm test
```

## 🚀 Deployment

Instructions for deploying both frontend and backend applications.

### Backend Deployment
- Steps for deploying Rails app

### Frontend Deployment
- Steps for deploying Next.js app

## 📝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the [LICENSE NAME] - see the [LICENSE.md](LICENSE.md) file for details

## 👥 Authors

- **Your Name** - *Initial work* - [Oye Olalekan Johnson](https://github.com/oyeolamilekan)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- References
