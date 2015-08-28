require 'fileutils'
require 'json'

module DataExporters
	class ExportPatchNamesForRetraining

		def initialize(iterationId, outputFile)
			@iteration = ::Iteration.find(iterationId)
			@outputFile = outputFile

			@chiaVersionIdMajor = @iteration.major_chia_version_id
			@chiaVersionIdMinor = @iteration.minor_chia_version_id

			@detectableClsNameMap = DataImporters::DetectableClsNameMap.new(@chiaVersionIdMajor)
			@patchCombiner = Metrics::Retraining::PatchCombiner.new(@iteration)

			@chiaVersion = ::ChiaVersion.find(@chiaVersionIdMajor)
			@detectables = ::Detectable.where(id: @chiaVersion.chia_version_detectables.pluck(:detectable_id))
		end

		def export
			exportToFile = {}
			@detectables.each do |detectable|
				@patchCombiner.combineSelfSingle(detectable.id)

				next if States::DetectableType.new(detectable).isAvoid?
				exportToFile[@detectableClsNameMap.getClsName(detectable.id)] = exportSingle(detectable.id)
			end
			File.open(@outputFile, "w") do |f|
				f.write(JSON.pretty_generate(exportToFile))
			end
			exportToFile
		end

		def exportSingle(detId)
			# combine parent patches with duplicate removal from parent
			parentPatches = @iteration.iteration_trackers.where(detectable_id: detId).first.getPatchesParents
			parentPatchesRemoval = @iteration.iteration_trackers.where(detectable_id: detId).first.getPatchesParentsRemoval
			# subtract patches to remove
			parentPatchesRemoval.each do |fn, cnt|
				parentPatchesRemoval[fn] = -1 * cnt
			end
			parentPatches = @patchCombiner.combineTwoHash(parentPatches, parentPatchesRemoval)			

			# combine with self patches
			selfPatches = @iteration.iteration_trackers.where(detectable_id: detId).first.getPatchesSelf
			selfPatches = @patchCombiner.combineTwoHash(selfPatches, parentPatches)

			selfPatches
		end

	end
end
