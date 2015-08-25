class Patch
  include Mongoid::Document

  field :inc, as: :included, type: Boolean
  field :fn, as: :file_name, type: String
  field :sc, as: :score, type: Float

  belongs_to :patch_bucket
end
