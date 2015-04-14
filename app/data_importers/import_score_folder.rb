require 'json'
require 'csv'

module DataImporters
	class ImportScoreFolder

		def initialize(scoreFolder, videoId, chiaVersionId)
			@scoreFolder = scoreFolder
			@videoId = videoId
			@chiaVersionId = chiaVersionId
		end

		def saveToDb()
			# skip log creation
			oldLogger = Moped.logger
			Moped.logger = Logger.new(StringIO.new)

			fnHash = getOrderedFiles(@scoreFolder)
			saveToDb_vfData(fnHash)

			# create indexes if not there yet
			Rails.logger.debug { "ImportScoreFolder : Creating indexes" }
			FrameScore.no_timeout.create_indexes
			Localization.no_timeout.create_indexes

			# reset old logger
			Moped.logger = oldLogger

			return true
		end

		def saveToDb_vfData(fnHash)
			# error out if chia version data is already there
			# TODO: make more robust - if expiring scores, then this will have to change
			# if scoresExist()
			# 	raise RuntimeError("VideoId: #{@videoId}, ChiaVersionId: #{@chiaVersionId} - scores already exists")
			# end

			# set up utility classes
			detectableChiaIdMap = DataImporters::DetectableChiaIdMap.new(@chiaVersionId)
			frameScoreFormatter = DataImporters::Formatters::FrameScoreFormatter.new(
				detectableChiaIdMap, @videoId, @chiaVersionId)
			localizationFormatter = DataImporters::Formatters::LocalizationFormatter.new(
				detectableChiaIdMap, @videoId, @chiaVersionId)
			frameScoreDumper = DataImporters::MongoCollectionDumper.new('FrameScore')
			localizationDumper = DataImporters::MongoCollectionDumper.new('Localization')

			# logging infrastructure
			totalFramesSaved = 0
			startTime = Time.now()

			fnHash.each do |frameNumber, jsonFile|
				jsonFileHash = JSON.load(File.open(jsonFile))
				frameNumber = jsonFileHash['frame_number'].to_i
				frameTime = jsonFileHash['frame_time'].to_f


				formattedFS = frameScoreFormatter.getFormatted(frameNumber, frameTime, jsonFileHash["scores"])
				frameScoreDumper.add(formattedFS)

				jsonFileHash["localizations"].each do |chiaClsId, lclzArr|
					lclzArr.each do |lclzs|
						formattedL = localizationFormatter.getFormatted(frameNumber, frameTime, chiaClsId, lclzs)
						localizationDumper.add(formattedL)
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

			frameScoreDumper.finalize()
			localizationDumper.finalize()
		end

		def getOrderedFiles(scoreFolder)
			fnHash = {}
			# while technically the order doesn't matter in the database, it makes for easy debugging
			Rails.logger.debug { "ImportScoreFolder : Sorting files prior to import" }
			Dir.glob("#{scoreFolder}/*.json") do |jsonFile|
				jsonFileHash = JSON.load(File.open(jsonFile))
				frameNumber = jsonFileHash['frame_number'].to_i
				fnHash[frameNumber] = jsonFile
			end
			fnHash = Hash[fnHash.sort]
			Rails.logger.debug { "ImportScoreFolder : Done sorting files. Ready for import" }
			return fnHash
		end

		def scoresExist()
			return VideoFrame.where(video_id: @videoId).first
				.frame_scores.where(chia_version_id: @chiaVersionId).count > 0
		end

	end
end
