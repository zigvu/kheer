class Sport < ActiveRecord::Base

  has_many :leagues, dependent: :destroy
  has_many :event_types, dependent: :destroy
  # through relationships
  has_many :teams, through: :leagues
  has_many :seasons, through: :leagues
  has_many :sub_seasons, through: :seasons
  has_many :games, through: :sub_seasons
end
