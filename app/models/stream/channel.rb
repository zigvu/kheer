class Channel < ActiveRecord::Base

  has_many :channel_videos, dependent: :destroy
  # through relationships
  has_many :videos, through: :channel_videos
end
