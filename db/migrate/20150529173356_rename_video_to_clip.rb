class RenameVideoToClip < ActiveRecord::Migration
  def change
    rename_table :videos, :clips

    rename_column :clips, :video_collection_id, :video_id
    rename_column :clips, :video_url, :clip_url
  end
end
