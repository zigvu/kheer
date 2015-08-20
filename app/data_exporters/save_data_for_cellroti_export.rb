require 'json'
require 'fileutils'

module DataExporters
	class SaveDataForCellrotiExport

		def initialize(cellrotiExport)
			@cellrotiExport = cellrotiExport
			@locFormatter = DataExporters::Formatters::LocalizationFormatterForCellroti.new
			@eventFormatter = DataExporters::Formatters::EventFormatterForCellroti.new
		end

		def delete_export_folders
			@cellrotiExport.video_ids.each do |videoId|
				video = ::Video.find(videoId)
				Managers::MVideo.new(video).delete_export_folder(@cellrotiExport.id)
			end
		end

		def save
			# Files consumed in cellroti by: app/metrics/video_data_import.rb

			videoIdFileNameMap = {}
			@cellrotiExport.video_ids.each do |videoId|
				fileNameMap = saveSingleVideo(videoId)
				videoIdFileNameMap[videoId] = fileNameMap
			end
			videoIdFileNameMap
		end

		def saveSingleVideo(videoId)
			video = ::Video.find(videoId)
			outputFolder = Managers::MVideo.new(video).get_export_folder(@cellrotiExport.id)

			fileNameMap = {}
			fileNameMap[:video_meta_data] = createVideoMetaData(outputFolder, videoId)
			fileNameMap[:detectable_ids] = createDetectableIds(outputFolder)
			fileNameMap[:events] = createEvents(outputFolder, videoId)
			fileNameMap[:localizations] = createLocalizationData(outputFolder, videoId)
			fileNameMap
		end

		def createVideoMetaData(outputFolder, videoId)
			outputFile = "#{outputFolder}/video_metadata.json"
			FileUtils::rm_rf(outputFile)

			video = ::Video.find(videoId)
			cellrotiGameId = video.games.first.cellroti_id
			cellrotiChannelId = video.channels.first.cellroti_id
			# TODO: get from config
			startFrameNumber = 1
			# startFrameNumber = video.clips.pluck(:frame_number_start).min
			endFrameNumber = video.clips.pluck(:frame_number_end).max

			formattedVideo = {
				kheer_video_id: video.id,
				title: video.title,
				source_type: video.source_type,
				quality: video.quality,
				playback_frame_rate: video.playback_frame_rate,
				detection_frame_rate: video.detection_frame_rate,
				game_id: cellrotiGameId,
				channel_id: cellrotiChannelId,
				start_frame_number: startFrameNumber,
				end_frame_number: endFrameNumber,
				width: video.width,
				height: video.height
			}
			File.open(outputFile, 'w') do |f|
				videoMetaData = {video_meta_data: formattedVideo}
				f.puts "#{videoMetaData.to_json}"
			end
			outputFile
		end

		def createDetectableIds(outputFolder)
			outputFile = "#{outputFolder}/detectable_ids.json"
			FileUtils::rm_rf(outputFile)

			allDetIds = @cellrotiExport.zdist_threshs.map{ |detId, zd| detId.to_i }
			cellrotiDetIds = @locFormatter.getCellDetIds(allDetIds)
			File.open(outputFile, 'w') do |f|
				detIds = {detectable_ids: cellrotiDetIds}
				f.puts "#{detIds.to_json}"
			end
			outputFile
		end

		def createEvents(outputFolder, videoId)
			outputFile = "#{outputFolder}/events.json"
			FileUtils::rm_rf(outputFile)

			annos = ::Annotation.where(video_id: videoId)
					.in(detectable_id: @cellrotiExport.event_detectable_ids)
					.order_by(frame_number: :asc)

			events = []
			annos.group_by{|a| a.frame_number}.each do |frameNumber, frameAnnos|
				formattedEvent = @eventFormatter.getFormatted(frameAnnos)
				events << {:"#{frameNumber}" => formattedEvent}
			end

			# { events: [{frame_number: [cellroti_event_type_id:, ]}, ]}
			File.open(outputFile, 'w') do |f|
				eventsFormatted = {events: events}
				f.puts "#{eventsFormatted.to_json}"
			end
			outputFile
		end

		def createLocalizationData(outputFolder, videoId)
			outputFile = "#{outputFolder}/localizations.json"
			FileUtils::rm_rf(outputFile)

			# Note: Cellroti ingests this line-by-line assuming each line is valid JSON
			# Also note that localizations are assumed to be ordered by frame_number
			# format: 
			# { localizations: [
			# 	{frame_number: {cellroti_det_id: [{bbox: {x, y, width, height}, score: float}, ], }, }, 
			# ]}

			zdistQueries = []
			@cellrotiExport.zdist_threshs.each do |detId, zdistThresh|
				zdistQueries << ::Localization.where(
					detectable_id: detId.to_i, zdist_thresh: zdistThresh).selector
			end
			locs = ::Localization.where(video_id: videoId)
					.where(chia_version_id: @cellrotiExport.chia_version_id_loc)
					.or(*zdistQueries)
					.order_by(frame_number: :asc)

			firstLine = true
			File.open(outputFile, 'w') do |f|
				f.puts "{\"localizations\": ["
				locs.group_by{|l| l.frame_number}.each do |frameNumber, frameLocs|
					formattedLoc = @locFormatter.getFormatted(frameLocs)
					formattedLine = {:"#{frameNumber}" => formattedLoc}.to_json
					if firstLine
						formattedLine = "  #{formattedLine}"
						firstLine = false
					else
						formattedLine = ",\n  #{formattedLine}"
					end
					f << formattedLine
				end
				f.puts "\n]}"
			end
			outputFile
		end

	end
end
