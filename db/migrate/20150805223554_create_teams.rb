class CreateTeams < ActiveRecord::Migration
  def change
    create_table :teams do |t|
      t.string :name
      t.text :description
      t.string :icon_path
      t.references :league, index: true
      t.integer :cellroti_id

      t.timestamps
    end
  end
end
