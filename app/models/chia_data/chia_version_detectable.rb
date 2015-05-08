class ChiaVersionDetectable < ActiveRecord::Base
  belongs_to :chia_version
  belongs_to :detectable
end
