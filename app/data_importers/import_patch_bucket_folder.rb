require 'json'
require 'csv'

module DataImporters
	class ImportPatchBucketFolder

		def initialize(patchFolder)
			@patchFolder = patchFolder
			@patchDumper = DataImporters::MongoCollectionDumper.new('Patch')
		end

		def saveToDb
			# skip log creation
			oldLogger = Moped.logger
			Moped.logger = Logger.new(StringIO.new)

			saveToDb_patchData()

			# reset old logger
			Moped.logger = oldLogger

			return true
		end

		def saveToDb_patchData
			Dir.glob("#{@patchFolder}/*.json") do |jsonFile|
				jsonFileHash = JSON.load(File.open(jsonFile))
				annotationId = jsonFileHash["annotation_id"].to_s
				patcheFileNames = jsonFileHash["patches"]

				annotation = ::Annotation.find(annotationId)
				annotation.patch_bucket.delete if annotation.patch_bucket != nil
				patchBucket = annotation.create_patch_bucket()
				patcheFileNames.each do |patchFileName|
					# Note: this is tied to schema in Patch class
					patch = {
						inc: false,
						fn: patchFileName,
						sc: 0,
						patch_bucket_id: patchBucket.id
					}
					@patchDumper.add(patch)
				end
			end
			@patchDumper.finalize()
		end

	end
end
