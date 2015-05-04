class FrameScore
	include Mongoid::Document
	
	# meta data for indexing
	# -------------------------------------------
	field :vi, as: :video_id, type: Integer
	field :ci, as: :chia_version_id, type: Integer

	field :fn, as: :frame_number, type: Integer
	field :ft, as: :frame_time, type: Integer

	# NOTE: this field is stored as unstructured JSON as formatted
	# by khajuri with original chia ids for class ids (vs. detectable Ids)
	# khajuri format:
	# scores = {chiaId: {prob: [floats, ], fc8: [floats, ]}, }
	# To access the scores, use getScores function below
	#field :scores

	# index for faster traversal during ordering
	# -------------------------------------------
	index({ video_id: 1 }, { background: true })
	index({ chia_version_id: 1 }, { background: true })
	index({ frame_number: 1 }, { background: true })

	# convenience methods
	# -------------------------------------------
	def video
		return Video.find(self.video_id)
	end

	def chia_version
		return ChiaVersion.find(self.chia_version_id)
	end

	def getScores
		# we need to use moped instead of mongoid to get to the raw BSON
		db = Mongoid::Sessions.default
		collection = db[:frame_scores]
		rawBSON = collection.where(ci: self.ci, vi: self.vi, fn: self.fn).first
		return rawBSON['scores']
	end

end
