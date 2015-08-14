class CellrotiData::GameTeam < CellrotiData::StreamActions
  # note: if we send game_id or team_id from this object, this will be
  # kheer db ids - instead we want to pass on cellroti db ids
  @streamObjAttr = []
  # get :game_id, :team_id from controller
end
