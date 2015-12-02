require 'json'
require 'fileutils'

module DataExporters
	class SaveFrameForCellrotiExport

		def initialize(cellrotiExport)
			@cellrotiExport = cellrotiExport
		end

		def saveFrameNumbers(frameNumbersMap)
			videoIdFileNameMap = {}
			frameNumbersMap.each do |cellrotiVideoId, frameNumbers|
				videoId = findVideoId(cellrotiVideoId)
				video = ::Video.find(videoId)
				outputFolder = Managers::MVideo.new(video).get_export_folder(@cellrotiExport.id)
				videoIdFileNameMap[videoId] = saveFrameNumbersSingleVideo(outputFolder, frameNumbers)
			end
			videoIdFileNameMap
		end

		def saveFrameNumbersSingleVideo(outputFolder, frameNumbers)
			outputFile = "#{outputFolder}/frames_to_extract.txt"
			FileUtils::rm_rf(outputFile)

			File.open(outputFile, 'w') do |f|
				f.puts frameNumbers.to_s[1..-2].delete(' ').gsub(',', ' ')
			end

			fileNameMap = {}
			fileNameMap[:frames_to_extract] = outputFile
			fileNameMap
		end

		def findVideoId(cellrotiVideoId)
			@cellrotiVideoIdMap ||= @cellrotiExport.cellroti_video_id_map
			videoId = nil
			@cellrotiVideoIdMap.each do |vId, cellVId|
				if cellVId.to_i == cellrotiVideoId
					videoId = vId.to_i
					break
				end
			end
			raise "Couldn't find kheer video id for cellroti video id #{cellrotiVideoId}" if videoId == nil
			videoId
		end

		def exportToTmp
			tmpExportFolder = "/tmp/#{@cellrotiExport.id}"
			tmpFramesToExtractFolder = "/tmp/#{@cellrotiExport.id}/extract"
			tmpFramesToExtractMapFile = "/tmp/#{@cellrotiExport.id}/filemap.json"
			FileUtils::rm_rf(tmpExportFolder)
			FileUtils::mkdir_p(tmpFramesToExtractFolder)

			cellrotiVideoIdMap = @cellrotiExport.cellroti_video_id_map
			videoIdFileNameMap = @cellrotiExport.video_id_filename_map
			# format
			# {video_id: {cellroti_video_id:, frames_to_extract:}}
			outputMap = {}

			cellrotiVideoIdMap.each do |videoId, cellVideoId|
				framesToExtractFile = videoIdFileNameMap[videoId][:frames_to_extract]
				cpFramesToExtractFile = "#{tmpFramesToExtractFolder}/#{videoId}.txt"
				FileUtils.cp(framesToExtractFile, cpFramesToExtractFile)

				outputMap[videoId.to_i] = {
					cellroti_video_id: cellVideoId,
					frames_to_extract: "extract/#{videoId}.txt"
				}
			end

			File.open(tmpFramesToExtractMapFile, 'w') do |f|
				f.puts outputMap.to_json
			end
		end

	end
end
