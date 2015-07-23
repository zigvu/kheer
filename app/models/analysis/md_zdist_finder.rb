class MdZdistFinder
  include Mongoid::Document

	# format:
	# {detId: zDistSelected, }
	# where zDistSelected = -1 if ignore in query
	field :zt, as: :zdist_threshs, type: Hash
	# format
	# {spatial_intersection_thresh:, }
	field :sf, as: :smart_filter, type: Hash

	embedded_in :mining
end
