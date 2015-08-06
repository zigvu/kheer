# Sports management
crumb :sports do
  link "Sports", stream_sports_path
end

crumb :sport do |sport|
  link sport.name, stream_sport_path(sport)
  parent :sports
end

crumb :sport_edit do |sport|
  link sport.name, stream_sport_path(sport)
  parent :sports
end

crumb :sport_new do
  link "New sport"
  parent :sports
end

# League management
crumb :league do |league|
  link league.name, stream_league_path(league)
  parent :sport, league.sport
end

crumb :league_edit do |league|
  link league.name, stream_league_path(league)
  parent :sport, league.sport
end

crumb :league_new do |sport|
  link "New league"
  parent :sport, sport
end

# Season management
crumb :season do |season|
  link season.name, stream_season_path(season)
  parent :league, season.league
end

crumb :season_edit do |season|
  link season.name, stream_season_path(season)
  parent :league, season.league
end

crumb :season_new do |league|
  link "New season"
  parent :league, league
end

# SubSeason management
crumb :sub_season do |sub_season|
  link sub_season.name, stream_sub_season_path(sub_season)
  parent :season, sub_season.season
end

crumb :sub_season_edit do |sub_season|
  link sub_season.name, stream_sub_season_path(sub_season)
  parent :season, sub_season.season
end

crumb :sub_season_new do |season|
  link "New SubSeason"
  parent :season, season
end

# Game management
crumb :game do |game|
  link game.name, stream_game_path(game)
  parent :sub_season, game.sub_season
end

crumb :game_edit do |game|
  link game.name, stream_game_path(game)
  parent :sub_season, game.sub_season
end

crumb :game_new do |sub_season|
  link "New game"
  parent :sub_season, sub_season
end

# EventType management
crumb :event_type do |event_type|
  link event_type.detectable.pretty_name, stream_event_type_path(event_type)
  parent :sport, event_type.sport
end

crumb :event_type_edit do |event_type|
  link event_type.detectable.pretty_name, stream_event_type_path(event_type)
  parent :sport, event_type.sport
end

crumb :event_type_new do |sport|
  link "New Event Type"
  parent :sport, sport
end

# Team management
crumb :team do |team|
  link team.name, stream_team_path(team)
  parent :league, team.league
end

crumb :team_edit do |team|
  link team.name, stream_team_path(team)
  parent :league, team.league
end

crumb :team_new do |league|
  link "New team"
  parent :league, league
end
