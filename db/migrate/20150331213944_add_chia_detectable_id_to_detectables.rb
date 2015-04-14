class AddChiaDetectableIdToDetectables < ActiveRecord::Migration
  def change
    add_column :detectables, :chia_detectable_id, :integer
  end
end
