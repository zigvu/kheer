module Metrics::Retraining
	class RoundRobiner

		def initialize(iteration)
			@iteration = iteration

			@anCvIds = @iteration.annotation_chia_version_ids
			@chiaVersion = ::ChiaVersion.find(@iteration.major_chia_version)
			@detectables = ::Detectable.where(id: @chiaVersion.chia_version_detectables.pluck(:detectable_id))
		end

		def roundRobinAll(numPatches)
			# set all to not considered
			# not working
			#::PatchBucket.where(:patches.elem_match => {:con.gte => 1}).update_all("$set" => {"patches.$.con" => 0})
			# this is slow but gets the job done
			@iteration.patch_buckets.where(:patches.elem_match => {:con.gte => 1}).each do |pb|
				pb.patches.update_all(con: 0)
			end

			consideredSummary = {}
			@detectables.each do |det|
				parentDuplicateRemoved, newPatchesConsidered, duplicatePatchesConsidered = roundRobinSingle(det, numPatches)
				consideredSummary[det.id] = {
					num_parent_duplicate_removed: parentDuplicateRemoved,
					num_new_patches_considered: newPatchesConsidered,
					num_new_patches_duplicate: duplicatePatchesConsidered
				}
			end
			consideredSummary
		end

		def roundRobinSingle(detectable, numPatches)
			parentDuplicatePatchesRemoved = {}
			newPatchesConsidered = 0
			duplicatePatchesConsidered = 0

			# STEP 1:
			# if there are duplicates, remove them first by acquiring new ones
			tracker = @iteration.iteration_trackers.where(detectable_id: detectable.id).first
			pp = tracker.getPatchesParents
			if pp.count > 0
				# convert to sorted array
				pp = pp.sort_by { |k, v| v }.reverse
				# continue until we run out of duplicates
				while pp[0][1] > 1
					consideredThisLoop = 0

					patchBuckets = @iteration.patch_buckets
						.where(detectable_id: detectable.id)
						.order_by(chia_version_id: :desc)
					patchBuckets.each do |patchBucket|
						# consider only fresh patches and sort based on score
						bestPatch = patchBucket.patches
							.where(:included.lte => 0, :considered.lte => 0)
							.order_by(score: :asc).first
						next if bestPatch == nil

						# found a patch to replace duplicate
						pp[0][1] -= 1
						bestPatch.update(considered: (bestPatch.considered + 1))
						if parentDuplicatePatchesRemoved[pp[0][0]] == nil
							parentDuplicatePatchesRemoved[pp[0][0]] = 1
						else
							parentDuplicatePatchesRemoved[pp[0][0]] += 1
						end
						consideredThisLoop += 1

						# re-sort array and break if we don't have duplicates any more
						pp = pp.sort_by { |k, v| v }.reverse
						break if not pp[0][1] > 1
					end

					# if we run out patches, then can't do anything about duplicates
					break if consideredThisLoop == 0
				end
			end
			# update removal list
			tracker.setPatchesParentsRemoval(parentDuplicatePatchesRemoved)
			parentDuplicateRemoved = parentDuplicatePatchesRemoved.count

			# STEP 2:
			# add patches that have not yet been considered
			while newPatchesConsidered < numPatches
				consideredThisLoop = 0

				# round robin the patches
				patchBuckets = @iteration.patch_buckets
					.where(detectable_id: detectable.id)
					.order_by(chia_version_id: :desc)
				patchBuckets.each do |patchBucket|
					# consider only fresh patches and sort based on score
					bestPatch = patchBucket.patches
						.where(:included.lte => 0, :considered.lte => 0)
						.order_by(score: :asc).first
					next if bestPatch == nil

					# found a patch - mark as being considered
					bestPatch.update(considered: (bestPatch.considered + 1))
					newPatchesConsidered += 1
					consideredThisLoop += 1
					break if newPatchesConsidered >= numPatches
				end

				# if no patches were gotten in this loop, will not get in next loop either
				break if consideredThisLoop == 0
			end

			# STEP 3:
			# if there are no more fresh patches, we will have to duplicate
			if newPatchesConsidered < numPatches
				while newPatchesConsidered < numPatches
					consideredThisLoop = 0

					# round robin the patches
					patchBuckets = @iteration.patch_buckets
						.where(detectable_id: detectable.id)
						.order_by(chia_version_id: :desc)
					patchBuckets.each do |patchBucket|
						# since all patches have already been included, include the patch with least duplicate
						bestPatch = patchBucket.patches.order_by(considered: :asc).first
						next if bestPatch == nil

						# found next duplicate patch
						bestPatch.update(considered: (bestPatch.considered + 1))
						newPatchesConsidered += 1
						consideredThisLoop += 1
						duplicatePatchesConsidered += 1
						break if newPatchesConsidered >= numPatches
					end

					# if no patches were gotten in this loop, will not get in next loop either
					break if consideredThisLoop == 0
				end
			end

			return parentDuplicateRemoved, newPatchesConsidered, duplicatePatchesConsidered
		end

		def getSummaryCounts
			summaryCounts = {}
			@detectables.each do |det|
				annos = ::Annotation.in(chia_version_id: @anCvIds).where(detectable_id: det.id)
				patchBuckets = @iteration.patch_buckets.where(detectable_id: det.id)

				numParentPatches = 0
				numDuplicateParentPatches = 0
				if @iteration.parent != nil
					parentPatchCounts = @iteration.iteration_trackers.where(di: det.id).first.getPatchesParents.values
					numParentPatches = parentPatchCounts.sum
					numDuplicateParentPatches = parentPatchCounts.sum - parentPatchCounts.count
				end

				unUsedPatchesCount = patchBuckets.map{ |pb| pb.patches.lte(included: 0).count }.sum

				summaryCounts[det.id] = {
					det_id: det.id,
					det_name: det.pretty_name,
					num_annos: annos.count,
					num_patch_buckets: patchBuckets.count,
					num_parent_patches: numParentPatches,
					num_parent_duplicates: numDuplicateParentPatches,
					num_patches_unused: unUsedPatchesCount
				}
			end
			summaryCounts
		end

	end
end