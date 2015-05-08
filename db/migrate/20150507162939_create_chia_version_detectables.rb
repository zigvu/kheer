class CreateChiaVersionDetectables < ActiveRecord::Migration
  def change
    create_table :chia_version_detectables do |t|
      t.references :chia_version, index: true
      t.references :detectable, index: true
      t.integer :chia_detectable_id

      t.timestamps
    end
  end
end
