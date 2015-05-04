class PatchBox
  include Mongoid::Document

  # patch map stores values in an array of patch boxes
  # :pi indicates the index of that array
	field :pi, as: :patch_idx, type: Integer
	field :sl, as: :scale, type: Float

	field :x, type: Integer
	field :y, type: Integer
	field :w, type: Integer
	field :h, type: Integer

	field :cis, as: :cell_idxs, type: Array

	embedded_in :patch_map
end
