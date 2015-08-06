require 'test_helper'

class SubSeasonsControllerTest < ActionController::TestCase
  setup do
    @sub_season = sub_seasons(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:sub_seasons)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create sub_season" do
    assert_difference('SubSeason.count') do
      post :create, sub_season: { cellroti_id: @sub_season.cellroti_id, description: @sub_season.description, name: @sub_season.name, season_id: @sub_season.season_id }
    end

    assert_redirected_to sub_season_path(assigns(:sub_season))
  end

  test "should show sub_season" do
    get :show, id: @sub_season
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @sub_season
    assert_response :success
  end

  test "should update sub_season" do
    patch :update, id: @sub_season, sub_season: { cellroti_id: @sub_season.cellroti_id, description: @sub_season.description, name: @sub_season.name, season_id: @sub_season.season_id }
    assert_redirected_to sub_season_path(assigns(:sub_season))
  end

  test "should destroy sub_season" do
    assert_difference('SubSeason.count', -1) do
      delete :destroy, id: @sub_season
    end

    assert_redirected_to sub_seasons_path
  end
end
