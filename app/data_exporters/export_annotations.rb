require 'json'
require 'fileutils'

module DataExporters
	class ExportAnnotations

		def initialize(chiaVersionId, outputFolder)
			@chiaVersionId = chiaVersionId
			@outputFolder = outputFolder
			@detectableIdNameMap = {}

			FileUtils::mkdir_p(@outputFolder)
		end

		def export
			::Annotation.where(chia_version_id: @chiaVersionId).where(active: true)
				.group_by{|a1| a1.video_id}.each do |videoId, a2|
				
				video = Video.find(videoId)
				width = video.width
				height = video.height

				vidAnnoOutFolder = "#{@outputFolder}/#{videoId}/annotations"
				FileUtils::mkdir_p(vidAnnoOutFolder)
				frameIds = []
				frameIdsFilename = "#{@outputFolder}/#{videoId}/frame_ids.txt"

				a2.group_by{|a3| a3.frame_number}.each do |frameNumber, a4|
					frameIds << frameNumber
					annoFormatter = DataExporters::Formatters::AnnotationFormatter.new(
						@chiaVersionId, videoId, frameNumber, width, height)
					a4.group_by{|a5| a5.detectable_id}.each do |detId, a6|
						a6.each do |a7|
							annoFormatter.addAnnotation(getDetName(detId), a7)
						end
					end
					File.open("#{vidAnnoOutFolder}/#{annoFormatter.annoFilename}", "w") do |f|
						f.write(JSON.pretty_generate(annoFormatter.getFormatted()))
					end
				end
				File.open(frameIdsFilename, "w") do |f|
					f.write(frameIds.to_s[1..-2].gsub(/,/, '') + "\n")
				end
			end
			true
		end

		def getDetName(detId)
			if @detectableIdNameMap[detId] == nil
				@detectableIdNameMap[detId] = ::Detectable.find(detId).name
			end

			return @detectableIdNameMap[detId]
		end

	end
end
