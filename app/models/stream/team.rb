class Team < ActiveRecord::Base
  belongs_to :league
  has_many :game_teams, dependent: :destroy
  # through relationships
  has_many :games, through: :game_teams
end
