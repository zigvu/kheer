class Season < ActiveRecord::Base

  belongs_to :league
  has_many :sub_seasons, dependent: :destroy
  # through relationships
  has_many :games, through: :sub_seasons
end
