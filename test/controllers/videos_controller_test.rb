require 'test_helper'

class VideosControllerTest < ActionController::TestCase
  setup do
    @video = videos(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:videos)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create video" do
    assert_difference('Video.count') do
      post :create, video: { comment: @video.comment, description: @video.description, detection_frame_rate: @video.detection_frame_rate, end_time: @video.end_time, format: @video.format, height: @video.height, length: @video.length, playback_frame_rate: @video.playback_frame_rate, quality: @video.quality, runstatus: @video.runstatus, source_type: @video.source_type, source_url: @video.source_url, start_time: @video.start_time, title: @video.title, width: @video.width }
    end

    assert_redirected_to video_path(assigns(:video))
  end

  test "should show video" do
    get :show, id: @video
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @video
    assert_response :success
  end

  test "should update video" do
    patch :update, id: @video, video: { comment: @video.comment, description: @video.description, detection_frame_rate: @video.detection_frame_rate, end_time: @video.end_time, format: @video.format, height: @video.height, length: @video.length, playback_frame_rate: @video.playback_frame_rate, quality: @video.quality, runstatus: @video.runstatus, source_type: @video.source_type, source_url: @video.source_url, start_time: @video.start_time, title: @video.title, width: @video.width }
    assert_redirected_to video_path(assigns(:video))
  end

  test "should destroy video" do
    assert_difference('Video.count', -1) do
      delete :destroy, id: @video
    end

    assert_redirected_to videos_path
  end
end
