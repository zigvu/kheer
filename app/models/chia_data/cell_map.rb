class CellMap
  include Mongoid::Document

  field :ci, as: :chia_version_id, type: Integer
  field :cm, as: :cell_map, type: Hash
  field :w, as: :width, type: Integer
  field :h, as: :height, type: Integer

  # index for faster traversal during ordering
  index({ chia_version_id: 1 }, { background: true })

  def chia_version
    return ChiaVersion.find(self.chia_version_id)
  end

end
