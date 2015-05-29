class RenameVideoCollectionToVideo < ActiveRecord::Migration
  def change
    rename_table :video_collections, :videos
  end
end
