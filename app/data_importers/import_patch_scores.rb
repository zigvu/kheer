require 'json'
require 'csv'

module DataImporters
	class ImportPatchScores

		def initialize(chiaVersionIdMajor, chiaVersionIdMinor, patchScoreFile)
			@chiaVersionIdMajor = chiaVersionIdMajor
			@chiaVersionIdMinor = chiaVersionIdMinor
			@patchScoreFile = patchScoreFile

			@detectableClsNameMap = DataImporters::DetectableClsNameMap.new(@chiaVersionIdMajor)
		end

		def saveToDb
			# skip log creation
			oldLogger = Moped.logger
			Moped.logger = Logger.new(StringIO.new)

			saveToDb_patchData()

			# reset old logger
			Moped.logger = oldLogger

			return true
		end

		def saveToDb_patchData
			File.foreach(@patchScoreFile).with_index do |line, lineNum|
				# skip header
				next if lineNum == 0

				parsedCSV = CSV.parse(line).first
				fileName = parsedCSV[0]
				patch = ::Patch.where(file_name: fileName).first

				# if patch is NOT present, skip
				next if patch == nil

				patch.patch_bucket.update(
					major_evaluated_cid: @chiaVersionIdMajor, 
					minor_evaluated_cid: @chiaVersionIdMinor
				)
				detectableId = patch.patch_bucket.annotation.detectable_id
				patch.update(score: getPatchScore(parsedCSV, detectableId))
			end
		end

		def getPatchScore(parsedCSV, detectableId)
			chiaDetIds = @detectableClsNameMap.getChaiDetIds(detectableId)
			score = 0
			chiaDetIds.each do |chiaDetId|
				# need to add 1 since first item is filename in array
				score += parsedCSV[chiaDetId + 1].to_f
			end
			score
		end

	end
end
