module DataImporters
	class MongoCollectionDumper

		def initialize(mongoCollectionName)
			@mongoCollection = mongoCollectionName.constantize
			@itemArr = []
			@mongoBatchInsertSize = 100
		end

		def add(item)
			@itemArr << item
			dump() if @itemArr.count >= @mongoBatchInsertSize
		end

		def dump
			if @itemArr.count > 0
				@mongoCollection.no_timeout.collection.insert(@itemArr)
				@itemArr = []
			end
		end

		def finalize
			dump()
		end

		def count
			@itemArr.count
		end

	end
end
