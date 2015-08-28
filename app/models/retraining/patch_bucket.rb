class PatchBucket
  include Mongoid::Document

  # although we can infer these from annotation, keep these here for faster queries
  field :ci, as: :chia_version_id, type: Integer
  field :di, as: :detectable_id, type: Integer

  # chia version id for the scores in patches
  # -------------------------------------------
  field :ma, as: :major_evaluated_cid, type: Integer
  field :mi, as: :minor_evaluated_cid, type: Integer

  belongs_to :annotation
  belongs_to :iteration
  embeds_many :patches
end
