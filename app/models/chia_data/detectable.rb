class Detectable < ActiveRecord::Base
	has_many :chia_version_detectables, dependent: :destroy
end
