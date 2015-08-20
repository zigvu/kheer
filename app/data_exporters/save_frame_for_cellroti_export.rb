require 'json'
require 'fileutils'

module DataExporters
	class SaveFrameForCellrotiExport

		def initialize(cellrotiExport)
			@cellrotiExport = cellrotiExport
		end

		def gzipExtractedFrames
			videoIdFileNameMap = {}
			cellrotiVideoIdFileNameMap = {}
			@cellrotiExport.cellroti_video_id_map.each do |videoId, cellrotiVideoId|
				video = ::Video.find(videoId.to_i)
				outputFolder = Managers::MVideo.new(video).get_export_folder(@cellrotiExport.id)

				fileNameMap = gzipExtractedFramesSingleVideo(outputFolder)

				videoIdFileNameMap[videoId.to_i] = fileNameMap
				cellrotiVideoIdFileNameMap[cellrotiVideoId] = fileNameMap[:gzip_extracted_frames]
			end
			return videoIdFileNameMap, cellrotiVideoIdFileNameMap
		end

		def gzipExtractedFramesSingleVideo(outputFolder)
			outputFile = "#{outputFolder}/extracted_frames.tar.gz"
			FileUtils::rm_rf(outputFile)
			inputFolder = "#{outputFolder}/extracted_frames"

			Dir.chdir(inputFolder) do
				%x{tar -zcvf "#{outputFile}" *}
			end

			fileNameMap = {}
			fileNameMap[:gzip_extracted_frames] = outputFile
			fileNameMap
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
				f.puts frameNumbers.to_s[1..-2].delete(' ')
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

	end
end
