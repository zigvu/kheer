class KheerJob
  include Mongoid::Document

  validates :video_id, presence: true
  validates :chia_version_id, presence: true
  validate :validate_no_duplicates, on: :create

  # meta data for indexing
  # -------------------------------------------
  field :vi, as: :video_id, type: Integer
  field :ci, as: :chia_version_id, type: Integer
  field :st, as: :state, type: String

  # job summary
  # -------------------------------------------
  # format:
  # {detId: counts, }
  # where counts:
  #   {num_anno:, num_locs: [count_zdist_thresh, ]}
  field :sc, as: :summary_counts, type: Hash

  # convenience methods
  # -------------------------------------------

  def video
    return Video.find(self.video_id)
  end

  def chia_version
    return ChiaVersion.find(self.chia_version_id)
  end

  def validate_no_duplicates
    if ::KheerJob.where(video_id: video_id)
        .where(chia_version_id: chia_version_id).count != 0
      errors.add(:chia_version_id, "Kheer Job already exists!")
    end
  end

  # class methods
  # -------------------------------------------
  def self.intersection_threshs
    [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
  end

  has_many :summary_confusion_finders, dependent: :destroy
  has_many :summary_zdist_differencers, dependent: :destroy
end
