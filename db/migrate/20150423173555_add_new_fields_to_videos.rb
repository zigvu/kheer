class AddNewFieldsToVideos < ActiveRecord::Migration
  def change
    add_reference :videos, :video_collection, index: true
    add_column :videos, :video_url, :string
    add_column :videos, :frame_number_start, :integer
    add_column :videos, :frame_number_end, :integer
  end
end
