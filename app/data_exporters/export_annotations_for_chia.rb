require 'json'
require 'fileutils'

module DataExporters
	class ExportAnnotationsForChia

		def initialize(chiaVersionId, outputFolder, avoidLabel)
			@chiaVersionId = chiaVersionId
			@outputFolder = outputFolder
			@avoidLabel = avoidLabel
			@detectableIdNameMap = {}

			chiaVersionType = ::ChiaVersion.find(chiaVersionId).ctype
			@allOtherChiaVersionIds = ::ChiaVersion.where(
				ctype: chiaVersionType).pluck(:id) - [@chiaVersionId]

			FileUtils::mkdir_p(@outputFolder)
		end

		def export
			::Annotation.where(chia_version_id: @chiaVersionId).where(active: true)
				.order(frame_number: :asc)
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
					# add annotations from other chia versions
					allOtherAnnotations = ::Annotation.in(chia_version_id: @allOtherChiaVersionIds)
						.where(active: true)
						.where(video_id: videoId)
						.where(frame_number: frameNumber)
					allOtherAnnotations.each do |otherAnno|
						annoFormatter.addAnnotation(@avoidLabel, otherAnno)
					end
					# save file
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
