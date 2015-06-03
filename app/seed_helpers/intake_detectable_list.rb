require 'json'
require 'csv'

module SeedHelpers
	class IntakeDetectableList
		attr_accessor :csvData

		def initialize(intakeListCSVFile)
			@csvData = {}
			counter = 0
			CSV.foreach(intakeListCSVFile) do |row|
				organizationBrandName = row[0]
				organizationOwnerName = row[1]
				organizationIndustry = row[2]
				detectableName = row[3]
				detectablePrettyName = row[4]
				detectableDescription = row[5]
				chiaDetectableName = row[6]
				chiaDetectableId = row[7]

				if counter < 2
					# don't do anything for the first two rows
				else
					if @csvData[organizationOwnerName] == nil
						@csvData[organizationOwnerName] = {
							industry: organizationIndustry,
							detectables: []
						}
					end
					@csvData[organizationOwnerName][:detectables] << {
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
					detectable = Detectable.create(
						name: d[:name], pretty_name: d[:pretty_name], description: d[:description])
					detectable.chia_version_detectables.create(
						chia_detectable_id: d[:chia_detectable_id], chia_version_id: chiaVersionId)
				end
			end
			true
		end
	end
end