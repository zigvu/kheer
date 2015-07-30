class MdConfusionFinder
  include Mongoid::Document

	# format:
	# { filters: [
  #   {pri_det_id:, sec_det_id:, number_of_localizations:, 
  #     selected_filters: {
  #       pri_zdist:, pri_scales: [floats], 
  #       sec_zdist:, sec_scales: [floats], int_threshs: [floats]
  #     }
  #   }
  # ]}
	field :cf, as: :confusion_filters, type: Hash

	embedded_in :mining
end
