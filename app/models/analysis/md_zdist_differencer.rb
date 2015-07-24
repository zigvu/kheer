class MdZdistDifferencer
  include Mongoid::Document

	# format:
	# {detId: zDistSelected, }
  field :ztp, as: :zdist_threshs_pri, type: Hash
  field :zts, as: :zdist_threshs_sec, type: Hash
	# format
	# {spatial_intersection_thresh:, }
	field :sf, as: :smart_filter, type: Hash

	embedded_in :mining
end
