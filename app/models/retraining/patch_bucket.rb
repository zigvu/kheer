class PatchBucket
  include Mongoid::Document

  # chia version id for the scores in patches
  # -------------------------------------------
  field :ma, as: :major_evaluated_cid, type: Integer
  field :mi, as: :minor_evaluated_cid, type: Integer

  # NOTE: we may not need this
  # # track current patch in sorted_patches
  # # -------------------------------------------
  # field :cp, as: :current_patch_id, type: Moped::BSON::ObjectId

  def sorted_patches
    patches.order_by(score: :asc)
  end

  def sorted_non_evaluated_patches
    sorted_patches.where(included: false)
  end

  belongs_to :annotation
  has_many :patches, dependent: :destroy
end
