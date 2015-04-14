class Localization
	include Mongoid::Document
	
	# meta data for indexing
	# -------------------------------------------
	field :vi, as: :video_id, type: Integer
	field :ci, as: :chia_version_id, type: Integer

	field :fn, as: :frame_number, type: Integer
	field :ft, as: :frame_time, type: Integer

	# scores
	# -------------------------------------------
	field :di, as: :detectable_id, type: Integer

	field :ps, as: :prob_score, type: Float
	field :zd, as: :zdist_thresh, type: Float
	field :sl, as: :scale, type: Float

	field :x, type: Integer
	field :y, type: Integer
	field :w, type: Integer
	field :h, type: Integer


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

end
