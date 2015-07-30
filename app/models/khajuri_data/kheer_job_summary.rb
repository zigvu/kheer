class KheerJobSummary
  include Mongoid::Document

  # meta data for indexing
  # -------------------------------------------
  field :pzt, as: :pri_zdist_thresh, type: Float
  field :szt, as: :sec_zdist_thresh, type: Float
  field :psl, as: :pri_scale, type: Float
  field :ssl, as: :sec_scale, type: Float
  field :inth, as: :int_thresh, type: Float

  # job summary
  # -------------------------------------------
  # format:
  # {priDetId: {secDetId: confCount, }, }
  field :cmat, as: :confusion_matrix, type: Hash

  belongs_to :kheer_job
end
