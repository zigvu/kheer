class ColorMap
  include Mongoid::Document

  field :ci, as: :chia_version_id, type: Integer
  field :cm, as: :color_map, type: Hash

  # index for faster traversal during ordering
  index({ chia_version_id: 1 }, { background: true })

  def chia_version
    return ChiaVersion.find(self.chia_version_id)
  end

end
