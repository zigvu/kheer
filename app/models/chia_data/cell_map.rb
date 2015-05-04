class CellMap
  include Mongoid::Document

  field :ci, as: :chia_version_id, type: Integer
	field :w, type: Integer
	field :h, type: Integer

	# index for faster traversal during ordering
	index({ chia_version_id: 1 }, { background: true })

	def chia_version
		return ChiaVersion.find(self.chia_version_id)
	end

	# NOTE: all cell boxes are in scale 1
	embeds_many :cell_boxes
end
