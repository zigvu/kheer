class PatchMap
  include Mongoid::Document

  field :ci, as: :chia_version_id, type: Integer
	field :w, type: Integer
	field :h, type: Integer
	field :sc, as: :scales, type: Array
	field :cm, as: :color_map, type: Hash

	# index for faster traversal during ordering
	index({ chia_version_id: 1 }, { background: true })

	def chia_version
		return ChiaVersion.find(self.chia_version_id)
	end

	embeds_many :patch_boxes
end
