require 'json'
require 'fileutils'

module DataImporters
	class ImportVideoFile

		def initialize(scoreFolderReader, videoCollection, videoURL)
			@scoreFolderReader = scoreFolderReader
			@videoCollection = videoCollection
			@videoURL = videoURL

			@railsPublicDir = Rails.root.join('public').to_s
			@videoBaseDir = "/data/videos"
		end

		def create
			sortedFn = @scoreFolderReader.sortedFrameNumbers

			# TODO: check if video exists

			# create new entry
			video = @videoCollection.videos.create(
				length: (1000.0 * (sortedFn.max - sortedFn.min) / @videoCollection.playback_frame_rate),
				frame_number_start: sortedFn.min,
				frame_number_end: sortedFn.max
			)

			# move video file to correct location
			folderName = "#{@videoBaseDir}/#{@videoCollection.id}"
			fullFolderName = "#{@railsPublicDir}#{folderName}"

			fileExt = File.basename(@videoURL).split('.').last
			fileName = "#{folderName}/#{video.id}.#{fileExt}"
			fullFileName = "#{fullFolderName}/#{video.id}.#{fileExt}"

			FileUtils.mkdir_p(fullFolderName)
			FileUtils.mv(@videoURL, fullFileName)

			# update video url
			video.update(video_url: fileName)

			return video
		end

	end
end
