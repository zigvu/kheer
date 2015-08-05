class Mining
  include Mongoid::Document
  after_create :createMiningData
  
  # meta data
  # -------------------------------------------
  field :nm, as: :name, type: String
  field :ds, as: :description, type: String
  field :ui, as: :user_id, type: Integer
  field :st, as: :state, type: String
  field :mt, as: :mtype, type: String

  # mining setup
  # -------------------------------------------
  field :cil, as: :chia_version_id_loc, type: Integer
  field :cia, as: :chia_version_id_anno, type: Integer
  field :vis, as: :video_ids, type: Array
  # format
  # {setId: [{video_id:, :clip_id, :loc_count, fn_count:, fn_visited_count:}, ]}
  field :cs, as: :clip_sets, type: Hash


  # index for faster traversal during ordering
  # -------------------------------------------
  index({ user_id: 1 }, { background: true })

  # polymorphism requirements
  # -------------------------------------------

  def createMiningData
    if States::MiningType.new(self).isZdistFinder?
      self.create_md_zdist_finder
    elsif States::MiningType.new(self).isChiaVersionComparer?
      self.create_md_chia_version_comparer
    elsif States::MiningType.new(self).isZdistDifferencer?
      self.create_md_zdist_differencer
    elsif States::MiningType.new(self).isConfusionFinder?
      self.create_md_confusion_finder
    elsif States::MiningType.new(self).isSequenceViewer?
      # don't need extra data
    end
  end

  # convenience methods
  # -------------------------------------------

  def user
    return User.find(self.user_id)
  end

  def chiaVersionLoc
    return ChiaVersion.find(self.chia_version_id_loc)
  end

  def chiaVersionAnno
    return ChiaVersion.find(self.chia_version_id_anno)
  end


  # data for mining is embedded in one of the sub documents
  embeds_one :md_zdist_finder
  embeds_one :md_chia_version_comparer
  embeds_one :md_zdist_differencer
  embeds_one :md_confusion_finder
end
