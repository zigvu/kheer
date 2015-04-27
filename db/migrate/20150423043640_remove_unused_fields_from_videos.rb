class RemoveUnusedFieldsFromVideos < ActiveRecord::Migration
  def change
    remove_column :videos, :title, :text
    remove_column :videos, :description, :text
    remove_column :videos, :comment, :text
    remove_column :videos, :source_type, :string
    remove_column :videos, :source_url, :string
    remove_column :videos, :quality, :string
    remove_column :videos, :format, :string
    remove_column :videos, :runstatus, :string
    remove_column :videos, :start_time, :datetime
    remove_column :videos, :end_time, :datetime
    remove_column :videos, :playback_frame_rate, :float
    remove_column :videos, :detection_frame_rate, :float
    remove_column :videos, :width, :integer
    remove_column :videos, :height, :integer
  end
end
