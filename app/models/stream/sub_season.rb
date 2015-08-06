class SubSeason < ActiveRecord::Base

  belongs_to :season
  has_many :games, dependent: :destroy
end
