require 'test_helper'

class GameTeamsControllerTest < ActionController::TestCase
  setup do
    @game_team = game_teams(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:game_teams)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create game_team" do
    assert_difference('GameTeam.count') do
      post :create, game_team: { cellroti_id: @game_team.cellroti_id, game_id: @game_team.game_id, team_id: @game_team.team_id }
    end

    assert_redirected_to game_team_path(assigns(:game_team))
  end

  test "should show game_team" do
    get :show, id: @game_team
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @game_team
    assert_response :success
  end

  test "should update game_team" do
    patch :update, id: @game_team, game_team: { cellroti_id: @game_team.cellroti_id, game_id: @game_team.game_id, team_id: @game_team.team_id }
    assert_redirected_to game_team_path(assigns(:game_team))
  end

  test "should destroy game_team" do
    assert_difference('GameTeam.count', -1) do
      delete :destroy, id: @game_team
    end

    assert_redirected_to game_teams_path
  end
end
