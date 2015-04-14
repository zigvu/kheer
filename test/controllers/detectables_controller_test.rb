require 'test_helper'

class DetectablesControllerTest < ActionController::TestCase
  setup do
    @detectable = detectables(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:detectables)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create detectable" do
    assert_difference('Detectable.count') do
      post :create, detectable: { chia_versions_id: @detectable.chia_versions_id, description: @detectable.description, name: @detectable.name, pretty_name: @detectable.pretty_name }
    end

    assert_redirected_to detectable_path(assigns(:detectable))
  end

  test "should show detectable" do
    get :show, id: @detectable
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @detectable
    assert_response :success
  end

  test "should update detectable" do
    patch :update, id: @detectable, detectable: { chia_versions_id: @detectable.chia_versions_id, description: @detectable.description, name: @detectable.name, pretty_name: @detectable.pretty_name }
    assert_redirected_to detectable_path(assigns(:detectable))
  end

  test "should destroy detectable" do
    assert_difference('Detectable.count', -1) do
      delete :destroy, id: @detectable
    end

    assert_redirected_to detectables_path
  end
end
