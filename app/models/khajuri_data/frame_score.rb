class FrameScore
	include Mongoid::Document
	
	# meta data for indexing
	# -------------------------------------------
	field :vi, as: :video_id, type: Integer
	field :ci, as: :chia_version_id, type: Integer

	field :fn, as: :frame_number, type: Integer
	field :ft, as: :frame_time, type: Integer

	# NOTE: this field is stored as unstructured JSON as formatted
	# by class <TBD> - it is accessed outside of mongoid
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
		return self[:scores]
	end

end
