require 'json'
require 'csv'

module SeedHelpers
	class IntakeGameList

		def initialize(intakeListCSVFile, seasonId)
			@intakeListCSVFile = intakeListCSVFile
			@season = ::Season.find(seasonId)
			@league = @season.league
		end

		def readCSVandSave
			gameGroups, teamNames = readCSV
			saveToDb(gameGroups, teamNames)
		end

		def readCSV
			gameGroups = {}
			teamNames = []

			counter = 0
			CSV.foreach(@intakeListCSVFile) do |row|
				matchNumber = row[0].to_i
				location = row[1]
				datetime = row[2].to_s
				homeTeamCountry = row[3]
				homeTeamCode = row[4]
				awayTeamCountry = row[5]
				awayTeamCode = row[6]
				subSeasonName = row[7]

				if counter < 1
					# don't do anything for the first row
				else
					gameGroups[subSeasonName] = [] if gameGroups[subSeasonName] == nil
					gameGroups[subSeasonName] << {
						location: location,
						datetime: datetime.to_datetime,
						homeTeamCountry: homeTeamCountry,
						awayTeamCountry: awayTeamCountry
					}

					teamNames << homeTeamCountry
					teamNames << awayTeamCountry
				end

				counter += 1
			end
			return gameGroups, teamNames.uniq!
		end

		def saveToDb(gameGroups, teamNames)
			# first create teams
			teamDbIdMap = {}
			teamNames.each do |teamName|
				team = @league.teams.where(name: teamName).first_or_create
				teamDbIdMap[teamName] = team.id
			end
			# then create sub-seasons
			gameGroups.each do |subSeasonName, subSeasonDetails|
				subSeason = @season.sub_seasons.where(name: subSeasonName).first_or_create
				subSeason.update(description: "Has #{subSeasonDetails.count} games")
				subSeasonDetails.each do |subSeasonDetail|
					# search for existing game
					gameTeamIds = [
						teamDbIdMap[subSeasonDetail[:homeTeamCountry]],
						teamDbIdMap[subSeasonDetail[:awayTeamCountry]]
					]
					game = nil
					subSeason.games.each do |g|
						if g.teams.pluck(:id).sort == gameTeamIds.sort
							game = g
							break
						end
					end
					# if existing game doesn't exist, create
					if game == nil
						gameName = "#{subSeasonDetail[:homeTeamCountry]} vs. #{subSeasonDetail[:awayTeamCountry]}"
						game = subSeason.games.create(
							name: gameName,
							venue_stadium: subSeasonDetail[:location],
							start_date: subSeasonDetail[:datetime]
						)
						gameTeamIds.each do |teamId|
							game.game_teams.create(team_id: teamId)
						end
					end
				end
			end
			true
		end
	end
end
