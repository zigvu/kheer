require 'fileutils'
require 'json'

module DataExporters
	class ExportPatchNamesForQa

		def initialize(iterationId, outputFolder)
			@iteration = ::Iteration.find(iterationId)
			@outputFolder = outputFolder
			FileUtils.mkdir_p(outputFolder)

			@chiaVersionIdMajor = @iteration.major_chia_version_id
			@anCvIds = @iteration.annotation_chia_version_ids

			@detectableClsNameMap = DataImporters::DetectableClsNameMap.new(@chiaVersionIdMajor)

			@chiaVersion = ::ChiaVersion.find(@chiaVersionIdMajor)
			@detectables = ::Detectable.where(id: @chiaVersion.chia_version_detectables.pluck(:detectable_id))
		end

		def export
			@anCvIds.each do |annoCvId|
				exportToFile = {}
				@detectables.each do |detectable|
					next if States::DetectableType.new(detectable).isAvoid?
					exportToFile[@detectableClsNameMap.getClsName(detectable.id)] = exportSingle(detectable.id, annoCvId)
				end
				File.open("#{@outputFolder}/qa_patch_list_chia_version_id_#{annoCvId}.json", "w") do |f|
					f.write(JSON.pretty_generate(exportToFile))
				end
			end
		end

		def exportSingle(detId, annoCvId)
			# format
			# {filename: count}
			patchList = {}
			patchBuckets = @iteration.patch_buckets
				.where(detectable_id: detId)
				.where(chia_version_id: annoCvId)
			patchBuckets.each do |patchBucket|
				# get only 1 patch from bucket ordered by score
				bestPatch = patchBucket.patches.order_by(score: :asc).first
				patchList[bestPatch.id] = 1
			end
			patchList
		end

	end
end
