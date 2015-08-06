class Team < ActiveRecord::Base
  belongs_to :league
  has_many :game_teams, dependent: :destroy
end
