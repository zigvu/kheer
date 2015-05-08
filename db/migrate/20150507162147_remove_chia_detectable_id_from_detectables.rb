class RemoveChiaDetectableIdFromDetectables < ActiveRecord::Migration
  def change
    remove_column :detectables, :chia_detectable_id, :integer
  end
end
