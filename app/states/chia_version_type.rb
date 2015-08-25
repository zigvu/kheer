module States
	# Type:
	# object - object detection
	# event - event detection
	class ChiaVersionType < States::StateCommon

		@@possibleStates = [:object, :event]

		def initialize(chiaVersion)
			super(chiaVersion, :ctype) if chiaVersion != nil
		end

		# No way to share class variables in Ruby - so duplicate
		# Meta programming to create commonly used methods
		@@possibleStates.each do |ss|
			methodName = ss.slice(0,1).capitalize + ss.slice(1..-1)
			# Query method: Example: isDownloadQueue?
			define_method("is#{methodName}?") do
				currentState = getX
				self.send(ss).include?(currentState)
			end
			# Setter method: Example setDownloadQueue
			define_method("set#{methodName}") do
				setX(ss)
			end
			# State strings - instance methods
			define_method("#{ss}") do
				return ss.to_s
			end
		end

	end
end