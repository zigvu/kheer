module Jsonifiers
	module Detectable
		class DetectableFormatter

			def initialize(chiaVersionId)
				@chiaVersionId = chiaVersionId
			end

			def formatted
				detectables = []
				# format into what js expects
				# [{:id, :name, :pretty_name, :chia_detectable_id}, ]
				
				::ChiaVersionDetectable.where(chia_version_id: @chiaVersionId).each do |cvd|
					det = cvd.detectable
					detectables << {
						id: det.id,
						name: det.name,
						pretty_name: det.pretty_name,
						chia_detectable_id: cvd.chia_detectable_id
					}
				end

				return detectables
			end

		end
	end
end