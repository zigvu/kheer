class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :name
      t.text :description
      t.datetime :start_date
      t.datetime :end_date
      t.string :venue_city
      t.string :venue_stadium
      t.references :sub_season, index: true
      t.integer :cellroti_id

      t.timestamps
    end
  end
end
