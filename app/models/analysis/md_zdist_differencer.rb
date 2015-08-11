class MdZdistDifferencer
  include Mongoid::Document

  # format:
  # { filters: [
  #   {pri_det_id:, number_of_localizations:, 
  #     selected_filters: {
  #       pri_zdist:, pri_scales: [floats], 
  #       sec_zdists: [floats], int_thresh:
  #     }
  #   }
  # ]}
  field :cf, as: :confusion_filters, type: Hash

	embedded_in :mining
end
