class Annotation
  include Mongoid::Document
	
	# meta data for indexing
	# -------------------------------------------
	field :vi, as: :video_id, type: Integer
	field :ci, as: :chia_version_id, type: Integer

	field :fn, as: :frame_number, type: Integer
	field :ft, as: :frame_time, type: Integer

	field :at, as: :active, type: Boolean, default: true

	# annotation data
	# -------------------------------------------
	field :di, as: :detectable_id, type: Integer

	field :x0, type: Integer
	field :y0, type: Integer

	field :x1, type: Integer
	field :y1, type: Integer

	field :x2, type: Integer
	field :y2, type: Integer

	field :x3, type: Integer
	field :y3, type: Integer


	# index for faster traversal during ordering
	# -------------------------------------------
	index({ clip_id: 1 }, { background: true })
	index({ chia_version_id: 1 }, { background: true })
	index({ frame_number: 1 }, { background: true })

	# convenience methods
	# -------------------------------------------

	def clip
		return Clip.find(self.clip_id)
	end

	def chia_version
		return ChiaVersion.find(self.chia_version_id)
	end

end
