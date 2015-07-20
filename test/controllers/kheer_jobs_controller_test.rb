require 'test_helper'

class KheerJobsControllerTest < ActionController::TestCase
  setup do
    @kheer_job = kheer_jobs(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:kheer_jobs)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create kheer_job" do
    assert_difference('KheerJob.count') do
      post :create, kheer_job: { chia_version_id: @kheer_job.chia_version_id, state: @kheer_job.state, video_id: @kheer_job.video_id }
    end

    assert_redirected_to kheer_job_path(assigns(:kheer_job))
  end

  test "should show kheer_job" do
    get :show, id: @kheer_job
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @kheer_job
    assert_response :success
  end

  test "should update kheer_job" do
    patch :update, id: @kheer_job, kheer_job: { chia_version_id: @kheer_job.chia_version_id, state: @kheer_job.state, video_id: @kheer_job.video_id }
    assert_redirected_to kheer_job_path(assigns(:kheer_job))
  end

  test "should destroy kheer_job" do
    assert_difference('KheerJob.count', -1) do
      delete :destroy, id: @kheer_job
    end

    assert_redirected_to kheer_jobs_path
  end
end
