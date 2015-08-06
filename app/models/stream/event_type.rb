class EventType < ActiveRecord::Base
  belongs_to :sport
  belongs_to :detectable
end
