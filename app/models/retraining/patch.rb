class Patch
  include Mongoid::Document

  field :inc, as: :included, type: Integer
  field :con, as: :considered, type: Integer
  field :sc, as: :score, type: Float

  # put filename as ID - query is faster and filename is guaranteed to be unique
  field :_id, type: String, overwrite: true

  embedded_in :patch_bucket
end
