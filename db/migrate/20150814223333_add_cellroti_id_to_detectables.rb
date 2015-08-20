class AddCellrotiIdToDetectables < ActiveRecord::Migration
  def change
    add_column :detectables, :cellroti_id, :integer
  end
end
