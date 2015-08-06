class CreateSubSeasons < ActiveRecord::Migration
  def change
    create_table :sub_seasons do |t|
      t.string :name
      t.text :description
      t.references :season, index: true
      t.integer :cellroti_id

      t.timestamps
    end
  end
end
