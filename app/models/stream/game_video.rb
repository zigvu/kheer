class GameVideo < ActiveRecord::Base
  belongs_to :game
  belongs_to :video
end
