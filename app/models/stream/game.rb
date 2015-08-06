class Game < ActiveRecord::Base

  belongs_to :sub_season
  has_many :game_teams, dependent: :destroy
  has_many :game_videos, dependent: :destroy
  # through relationships
  has_many :teams, through: :game_teams
  has_many :videos, through: :game_videos
  # form helper
  accepts_nested_attributes_for :game_teams, allow_destroy: true, reject_if: :all_blank
  accepts_nested_attributes_for :game_videos, allow_destroy: true, reject_if: :all_blank
end
