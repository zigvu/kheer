require 'json'
require 'csv'

module SeedHelpers
	class IntakeDetectableList
		attr_accessor :csvData

		def initialize(intakeListCSVFile)
			@csvData = {}
			counter = 0
			CSV.foreach(intakeListCSVFile) do |row|
				organizationName = row[0]
				organizationIndustry = row[1]
				detectableName = row[2]
				detectablePrettyName = row[3]
				detectableDescription = row[4]
				chiaDetectableName = row[5]
				chiaDetectableId = row[6]

				if counter == 0
					# don't do anything
				else
					if @csvData[organizationName] == nil
						@csvData[organizationName] = {
							industry: organizationIndustry,
							detectables: []
						}
					end
					@csvData[organizationName][:detectables] << {
						name: detectableName,
						pretty_name: detectablePrettyName,
						description: detectableDescription,
						chia_detectable_id: chiaDetectableId.to_i
					}
				end

				counter += 1
			end
		end

		def saveToDb(chiaVersionId)
			@csvData.each do |org, orgData|
				# create detectables
				orgData[:detectables].each do |d|
					Detectable.create(
						name: d[:name], pretty_name: d[:pretty_name], description: d[:description],
						chia_detectable_id: d[:chia_detectable_id], chia_version_id: chiaVersionId)
				end
			end
			true
		end
	end
end