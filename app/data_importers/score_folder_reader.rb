require 'fileutils'
require 'json'

module DataImporters
	class ScoreFolderReader
		attr_accessor :orderedFiles, :sortedFrameNumbers

		def initialize(scoreFolder)
			@scoreFolder = scoreFolder
			@orderedFiles = getOrderedFiles(@scoreFolder)
			@sortedFrameNumbers = @orderedFiles.map{|k, v| k}.sort
		end

		def getOrderedFiles(scoreFolder)
			# hash structure
			# {frame_number: filename}
			orderedFiles = {}
			Rails.logger.debug { "ScoreFolderReader : Sorting files prior to import" }
			Dir.glob("#{scoreFolder}/*.json") do |jsonFile|
				jsonFileHash = JSON.load(File.open(jsonFile))
				frameNumber = jsonFileHash['frame_number'].to_i
				orderedFiles[frameNumber] = jsonFile
			end
			orderedFiles = Hash[orderedFiles.sort]
			Rails.logger.debug { "ScoreFolderReader : Done sorting files. Ready for import" }
			return orderedFiles
		end

		def delete
			FileUtils.rm_rf(@scoreFolder)
		end

	end
end
