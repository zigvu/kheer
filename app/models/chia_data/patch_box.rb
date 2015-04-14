class PatchBox
  include Mongoid::Document

	field :pi, as: :patch_id, type: Integer
	field :sl, as: :scale, type: Float

	field :x, type: Integer
	field :y, type: Integer
	field :w, type: Integer
	field :h, type: Integer

	embedded_in :patch_map
end
