class CreateChannels < ActiveRecord::Migration
  def change
    create_table :channels do |t|
      t.string :name
      t.text :description
      t.string :url
      t.integer :cellroti_id

      t.timestamps
    end
  end
end
