class CreateGameVideos < ActiveRecord::Migration
  def change
    create_table :game_videos do |t|
      t.references :game, index: true
      t.references :video, index: true
      t.integer :cellroti_id

      t.timestamps
    end
  end
end
