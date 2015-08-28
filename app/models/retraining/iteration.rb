class Iteration
  include Mongoid::Document
  
  # meta data
  # -------------------------------------------
  field :nm, as: :name, type: String
  field :ui, as: :user_id, type: Integer
  field :pi, as: :parent_iteration, type: BSON::ObjectId

  field :ma, as: :major_chia_version_id, type: Integer
  field :mi, as: :minor_chia_version_id, type: Integer
  field :st, as: :state, type: String
  field :aid, as: :annotation_chia_version_ids, type: Array

  # format:
  # {det_id: {count_details}, }
  # details in file app/metrics/retraining/round_robiner.rb
  field :smc, as: :summary_counts, type: Hash
  # format:
  # {det_id: {consider_details}
  # details in file app/metrics/retraining/round_robiner.rb
  field :scd, as: :summary_considered, type: Hash

  # index for faster traversal during ordering
  # -------------------------------------------
  index({ user_id: 1 }, { background: true })

  # convenience methods
  # -------------------------------------------

  def user
    return User.find(self.user_id)
  end

  def major_chia_version
    return ChiaVersion.find(self.major_chia_version_id)
  end

  def parent
    return nil if self.parent_iteration == nil
    return Iteration.find(self.parent_iteration)
  end

  has_many :iteration_trackers, dependent: :destroy
  has_many :patch_buckets, dependent: :destroy
end
