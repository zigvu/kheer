require 'test_helper'

class ChiaVersionsControllerTest < ActionController::TestCase
  setup do
    @chia_version = chia_versions(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:chia_versions)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create chia_version" do
    assert_difference('ChiaVersion.count') do
      post :create, chia_version: { comment: @chia_version.comment, description: @chia_version.description, name: @chia_version.name }
    end

    assert_redirected_to chia_version_path(assigns(:chia_version))
  end

  test "should show chia_version" do
    get :show, id: @chia_version
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @chia_version
    assert_response :success
  end

  test "should update chia_version" do
    patch :update, id: @chia_version, chia_version: { comment: @chia_version.comment, description: @chia_version.description, name: @chia_version.name }
    assert_redirected_to chia_version_path(assigns(:chia_version))
  end

  test "should destroy chia_version" do
    assert_difference('ChiaVersion.count', -1) do
      delete :destroy, id: @chia_version
    end

    assert_redirected_to chia_versions_path
  end
end
