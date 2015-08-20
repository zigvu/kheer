class CellrotiExport
  include Mongoid::Document
  
  # meta data
  # -------------------------------------------
  field :nm, as: :name, type: String
  field :ds, as: :description, type: String
  field :ui, as: :user_id, type: Integer
  field :st, as: :state, type: String

  # export setup
  # -------------------------------------------
  field :cil, as: :chia_version_id_loc, type: Integer
  field :cie, as: :chia_version_id_event, type: Integer
  field :vis, as: :video_ids, type: Array
  # format:
  # {detId: zDistSelected, }
  field :zt, as: :zdist_threshs, type: Hash
  field :edi, as: :event_detectable_ids, type: Array
  # format:
  # {video_id: file_name}
  field :vifn, as: :video_id_filename_map, type: Hash
  # video ids from cellroti we need to track
  # format:
  # {video_id: cellroti_video_id}
  field :cvidm, as: :cellroti_video_id_map, type: Hash

  # index for faster traversal during ordering
  # -------------------------------------------
  index({ user_id: 1 }, { background: true })

  # convenience methods
  # -------------------------------------------

  def user
    return User.find(self.user_id)
  end

  def chiaVersionLoc
    return ChiaVersion.find(self.chia_version_id_loc)
  end
end
