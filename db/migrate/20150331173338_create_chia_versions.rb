class CreateChiaVersions < ActiveRecord::Migration
  def change
    create_table :chia_versions do |t|
      t.string :name
      t.text :description
      t.text :comment

      t.timestamps
    end
  end
end
