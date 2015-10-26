class MdDetFinder
  include Mongoid::Document

  field :dis, as: :detectable_ids, type: Array
  field :pzd, as: :pri_zdist, type: Float
  field :szd, as: :sec_zdist, type: Float

  embedded_in :mining
end
