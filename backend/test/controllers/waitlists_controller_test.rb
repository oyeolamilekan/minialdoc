require "test_helper"

class WaitlistsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get waitlists_create_url
    assert_response :success
  end
end
