class RemoveChiaVersionIdFromDetectables < ActiveRecord::Migration
  def change
    remove_column :detectables, :chia_version_id, :integer
  end
end
