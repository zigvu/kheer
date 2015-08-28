module Metrics::Retraining
	class PatchCombiner

		def initialize(iteration)
			@iteration = iteration

			@chiaVersion = ::ChiaVersion.find(@iteration.major_chia_version)
			@detectableIds = @chiaVersion.chia_version_detectables.pluck(:detectable_id)
		end

		def combineSelfSingle(detId)
			iterationTracker = @iteration.iteration_trackers.where(detectable_id: detId).first

			# create self patches
			patchBuckets = @iteration.patch_buckets.where(detectable_id: detId)
			sPatches = {}
			patchBuckets.each do |patchBucket|
				consideredPatches = patchBucket.patches.where(:considered.gte => 1)
				consideredPatches.each do |patch|
					sPatches[patch.id] = patch.considered
				end
			end
			iterationTracker.setPatchesSelf(sPatches)
		end

		def combineParent
			# clean any iteration trackers currently set
			@iteration.iteration_trackers.destroy_all

			# format:
			# {det_id: {patchFileName: count, }, }
			combinedCountHash = {}
			@detectableIds.each do |detId|
				combinedCountHash[detId] = combineParentSingle(detId)
			end
			combinedCountHash
		end

		def combineParentSingle(detId)
			iterationTracker = @iteration.iteration_trackers.create(detectable_id: detId)

			pPatches = {}
			# copy over parents patches
			pIteration = @iteration.parent
			if pIteration != nil
				pIterationTracker = pIteration.iteration_trackers.where(detectable_id: detId).first
				pPatches = pIterationTracker.getPatchesParents
				pPatches = combineTwoHash(pPatches, pIterationTracker.getPatchesSelf)
			end # end pIteration
			iterationTracker.setPatchesParents(pPatches)
			pPatches
		end

		def combineTwoHash(hash1, hash2)
			# combine hash2 with hash1 and return hash1
			hash2.each do |k,v|
				if hash1[k] == nil
					hash1[k] = v
				else
					hash1[k] += v
				end
			end
			hash1
		end

	end
end
