require 'json'
require 'csv'

module DataImporters
	class ImportPatchBucketFolders

		def initialize(iterationId, patchFolder)
			@iteration = ::Iteration.find(iterationId)
			@patchFolder = patchFolder

			@chiaVersionIdMajor = @iteration.major_chia_version_id
			@chiaVersionIdMinor = @iteration.minor_chia_version_id
			@annotationChiaVersionIds = @iteration.annotation_chia_version_ids

			@patchBucketDumper = DataImporters::MongoCollectionDumper.new('PatchBucket')
			@detectableClsNameMap = DataImporters::DetectableClsNameMap.new(@chiaVersionIdMajor)
			@patchCombiner = Metrics::Retraining::PatchCombiner.new(@iteration)
		end

		def saveToDb
			# skip log creation
			oldLogger = Moped.logger
			Moped.logger = Logger.new(StringIO.new)

			puts "Resetting scores of patches in all patch buckets"
			@iteration.patch_buckets.destroy_all

			puts "Importing patches"
			saveToDb_patchData()

			puts "Create summary"
			sc = Metrics::Retraining::RoundRobiner.new(@iteration).getSummaryCounts
			@iteration.update(summary_counts: sc)

			# reset old logger
			Moped.logger = oldLogger

			return true
		end

		def saveToDb_patchData
			# create iteration trackers and get existing patch counts
			@existingPatchCounHash = @patchCombiner.combineParent

			# loop through all patch bucket files
			Dir.glob("#{@patchFolder}/*.json") do |jsonFile|
				jsonFileHash = JSON.load(File.open(jsonFile))
				annotationId = jsonFileHash["annotation_id"].to_s
				patchHash = jsonFileHash["patches"]

				annotation = ::Annotation.where(id: annotationId).first
				next if annotation == nil
				next if not @annotationChiaVersionIds.include?(annotation.chia_version_id)

				patchObjs = []
				patchHash.each do |patchFileName, patchScores|
					# Note: this is tied to schema in Patch class
					patchObjs << {
						_id: patchFileName,
						inc: getParentPatchCount(patchFileName, annotation.detectable_id),
						con: 0,
						sc: getPatchScore(patchScores, annotation.detectable_id)
					}
				end
				# Note: this is tied to schema in PatchBucket class
				patchBucket = {
					ci: annotation.chia_version_id,
					di: annotation.detectable_id,
					ma: @chiaVersionIdMajor,
					mi: @chiaVersionIdMinor,
					annotation_id: annotation.id,
					iteration_id: @iteration.id,
					patches: patchObjs
				}
				@patchBucketDumper.add(patchBucket)
			end
			@patchBucketDumper.finalize()
		end

		def getPatchScore(patchScores, detectableId)
			chiaDetIds = @detectableClsNameMap.getChaiDetIds(detectableId)
			score = 0
			chiaDetIds.each do |chiaDetId|
				score += patchScores[chiaDetId].to_f
			end
			score
		end

		def getParentPatchCount(patchFileName, detectableId)
			@existingPatchCounHash[detectableId][patchFileName] || 0
		end

	end
end
