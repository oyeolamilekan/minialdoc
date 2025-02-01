Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  scope "/api/v1" do
    scope "/webhooks" do
      post "/stripe", to: "webhooks#stripe"
    end

    scope "/subscriptions" do
      post "/create/:plan_id", to: "subscriptions#create"
    end

    scope "/auth" do
      post "/signup", to: "users#sign_up"
      post "/signin", to: "users#login"
      post "/change_password", to: "users#change_password"
    end

    scope "/organizations" do
      post "/create_organization", to: "organizations#create_organization"
      get "/fetch_users/:public_id", to: "organizations#fetch_users"
    end

    scope "/subscriptions" do
      get "/plans", to: "subscriptions#plans"
      get "/fetch_active_subscription", to: "subscriptions#fetch_active_subscription"
      post "/pay_subscription/:plan_id", to: "subscriptions#pay_subscription"
    end

    scope "/projects" do
      get "/", to: "api_projects#projects"
      post "/create_project", to: "api_projects#create_project"
      get "/fetch_project/:slug", to: "api_projects#fetch_project"
      put "/update_project/:slug", to: "api_projects#update_project"
      delete "/delete_project/:slug", to: "api_projects#delete_project"
    end

    scope "/sections" do
      get "/:project_slug", to: "api_sections#fetch_sections"
      post "/create_section/:project_slug", to: "api_sections#create_section"
      get "/fetch_section_endpoints/:project_slug", to: "api_sections#fetch_section_endpoints"
      put "/update_section/:section_slug", to: "api_sections#update_section"
      delete "/delete_section/:section_slug", to: "api_sections#delete_section"
    end

    scope "/endpoints" do
      get "/fetch_endpoint/:endpoint_slug", to: "api_endpoints#fetch_endpoint"
      put "/update_endpoint/:endpoint_slug", to: "api_endpoints#update_endpoint"
      post "/create_endpoint/:project_slug/:section_slug", to: "api_endpoints#create_endpoint"
      delete "/delete_endpoint/:endpoint_slug", to: "api_endpoints#delete_endpoint"
    end

    scope "/waitlist" do
      post "/join", to: "waitlists#create"
    end
  end
end
