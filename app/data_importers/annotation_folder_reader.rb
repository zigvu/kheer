require 'fileutils'
require 'json'

module DataImporters
	class AnnotationFolderReader
		attr_accessor :orderedFiles, :clsNames

		def initialize(annotationFolder)
			@orderedFiles, @clsNames = getOrderedFiles(annotationFolder)
		end

		def getOrderedFiles(annotationFolder)
			chiaVersionIds = []

			# hash structure
			# {video_id: {frame_number: filename}}
			orderedFiles = {}
			# [name, ]
			names = []

			Rails.logger.debug { "annotationFolderReader : Sorting files prior to import" }
			Dir.glob("#{annotationFolder}/*.json") do |jsonFile|
				jsonFileHash = JSON.load(File.open(jsonFile))
				chiaVersionId = jsonFileHash['chia_version_id'].to_i
				chiaVersionIds << chiaVersionId if not chiaVersionIds.include?(chiaVersionId)

				videoId = jsonFileHash['video_id'].to_i
				frameNumber = jsonFileHash['frame_number'].to_i

				jsonFileHash['annotations'].each do |cls, annos|
					names << cls if not names.include?(cls)
				end

				orderedFiles[videoId] = {} if orderedFiles[videoId] == nil
				orderedFiles[videoId][frameNumber] = jsonFile
			end
			orderedFiles = Hash[orderedFiles.sort]
			orderedFiles.each do |videoId, frameFiles|
				orderedFiles[videoId] = Hash[orderedFiles[videoId].sort]
			end

			if chiaVersionIds.count != 1
				raise RuntimeError, "Multiple chia version annotations in folder: #{chiaVersionIds}"
			end

			Rails.logger.debug { "annotationFolderReader : Done sorting files. Ready for import" }
			return orderedFiles, names
		end

	end
end
