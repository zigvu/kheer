class VideoCollection < ActiveRecord::Base
	has_many :videos, dependent: :destroy
end
