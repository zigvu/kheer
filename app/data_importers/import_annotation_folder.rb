require 'json'
require 'csv'

module DataImporters
	class ImportAnnotationFolder

		def initialize(annotationFolderReader, chiaVersion)
			@annotationFolderReader = annotationFolderReader
			@chiaVersionId = chiaVersion.id
		end

		def saveToDb
			# skip log creation
			oldLogger = Moped.logger
			Moped.logger = Logger.new(StringIO.new)

			saveToDb_annoData()

			# create indexes if not there yet
			Rails.logger.debug { "ImportAnnotationFolder : Creating indexes" }
			Annotation.no_timeout.create_indexes

			# reset old logger
			Moped.logger = oldLogger

			return true
		end

		def saveToDb_annoData
			annoHash = @annotationFolderReader.orderedFiles

			# set up utility classes
			detectableClsNameMap = DataImporters::DetectableClsNameMap.new(@chiaVersionId)
			annotationFormatter = DataImporters::Formatters::AnnotationFormatter.new(
				detectableClsNameMap, @chiaVersionId)
			annotationDumper = DataImporters::MongoCollectionDumper.new('Annotation')

			# error check - ensure all clsNames in annotation folder is available
			@annotationFolderReader.clsNames.each do |clsName|
				if detectableClsNameMap.getDetectableId(clsName) == nil
					raise RuntimeError, "Classname #{clsName} not present in chia version id #{@chiaVersionId}"
				end
			end


			# logging infrastructure
			totalFramesSaved = 0
			startTime = Time.now()

			annoHash.each do |vId, fnHash|
				fnHash.each do |frameNumber, jsonFile|
					jsonFileHash = JSON.load(File.open(jsonFile))
					videoId = jsonFileHash['video_id'].to_i
					frameNumber = jsonFileHash['frame_number'].to_i
					frameTime = nil

					jsonFileHash["annotations"].each do |clsName, annoArr|
						annoArr.each do |annotation|
							formattedA = annotationFormatter.getFormatted(
								videoId, frameNumber, frameTime, clsName, annotation)
							annotationDumper.add(formattedA)
						end
					end

					# logging
					if (totalFramesSaved % 100) == 0
						timeDiff = Time.now() - startTime
						Rails.logger.debug {  "Save: VideoId: #{@videoId}, NumOfFrames: #{totalFramesSaved}, Time: #{timeDiff}" }
						startTime = Time.now()
					end
					totalFramesSaved += 1
				end
			end
			annotationDumper.finalize()
		end

	end
end
