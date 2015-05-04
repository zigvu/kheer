class CellBox
  include Mongoid::Document

  # NOTE: all cell boxes are in scale 1

  # cell map stores values in an array of cell boxes
  # :ci indicates the index of that array
	field :ci, as: :cell_idx, type: Integer

	field :x, type: Integer
	field :y, type: Integer
	field :w, type: Integer
	field :h, type: Integer

	embedded_in :cell_map
end
