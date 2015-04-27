require 'test_helper'

class VideoCollectionsControllerTest < ActionController::TestCase
  setup do
    @video_collection = video_collections(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:video_collections)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create video_collection" do
    assert_difference('VideoCollection.count') do
      post :create, video_collection: { comment: @video_collection.comment, description: @video_collection.description, detection_frame_rate: @video_collection.detection_frame_rate, format: @video_collection.format, height: @video_collection.height, playback_frame_rate: @video_collection.playback_frame_rate, quality: @video_collection.quality, source_type: @video_collection.source_type, source_url: @video_collection.source_url, title: @video_collection.title, width: @video_collection.width }
    end

    assert_redirected_to video_collection_path(assigns(:video_collection))
  end

  test "should show video_collection" do
    get :show, id: @video_collection
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @video_collection
    assert_response :success
  end

  test "should update video_collection" do
    patch :update, id: @video_collection, video_collection: { comment: @video_collection.comment, description: @video_collection.description, detection_frame_rate: @video_collection.detection_frame_rate, format: @video_collection.format, height: @video_collection.height, playback_frame_rate: @video_collection.playback_frame_rate, quality: @video_collection.quality, source_type: @video_collection.source_type, source_url: @video_collection.source_url, title: @video_collection.title, width: @video_collection.width }
    assert_redirected_to video_collection_path(assigns(:video_collection))
  end

  test "should destroy video_collection" do
    assert_difference('VideoCollection.count', -1) do
      delete :destroy, id: @video_collection
    end

    assert_redirected_to video_collections_path
  end
end
