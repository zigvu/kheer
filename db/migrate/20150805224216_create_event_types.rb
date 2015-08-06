class CreateEventTypes < ActiveRecord::Migration
  def change
    create_table :event_types do |t|
      t.string :name
      t.text :description
      t.float :weight
      t.references :sport, index: true
      t.integer :cellroti_id

      t.timestamps
    end
  end
end
