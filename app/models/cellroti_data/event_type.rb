class CellrotiData::EventType < CellrotiData::StreamActions
  # note: we send pretty_name as name
  @streamObjAttr = [:description, :weight]
  # get sport_id, name from controller
end
