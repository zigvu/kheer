class CellrotiData::Game < CellrotiData::StreamActions
  @streamObjAttr = [:name, :description, :start_date, :venue_city, :venue_stadium]
  # get sub_season_id from controller
end
