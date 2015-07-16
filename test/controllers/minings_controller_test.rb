require 'test_helper'

class MiningsControllerTest < ActionController::TestCase
  setup do
    @mining = minings(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:minings)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create mining" do
    assert_difference('Mining.count') do
      post :create, mining: { settings: @mining.settings, state: @mining.state, user_id: @mining.user_id }
    end

    assert_redirected_to mining_path(assigns(:mining))
  end

  test "should show mining" do
    get :show, id: @mining
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @mining
    assert_response :success
  end

  test "should update mining" do
    patch :update, id: @mining, mining: { settings: @mining.settings, state: @mining.state, user_id: @mining.user_id }
    assert_redirected_to mining_path(assigns(:mining))
  end

  test "should destroy mining" do
    assert_difference('Mining.count', -1) do
      delete :destroy, id: @mining
    end

    assert_redirected_to minings_path
  end
end
