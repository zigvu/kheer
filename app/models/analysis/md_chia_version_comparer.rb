class MdChiaVersionComparer
  include Mongoid::Document

  field :ciSec, as: :chia_version_id_sec, type: Integer

  # format:
  # {detId: zDistSelected, }
  field :ztLoc, as: :zdist_threshs_loc, type: Hash
  # format:
  # {detId: zDistSelected, }
  field :ztSec, as: :zdist_threshs_sec, type: Hash
	# format
	# {spatial_intersection_thresh:, }
	field :sf, as: :smart_filter, type: Hash

	embedded_in :mining
end
