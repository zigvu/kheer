module States
	# Type:
	# zdistFinder - find zdist for a class by looking for FP confusions
	# chiaVersionComparer - compare performance of two chia versions in same frame
	# zdistDifferencer - find detectables that have localizations in one zdist but not in another
	class MiningType < States::StateCommon

		@@possibleStates = [:zdistFinder, :chiaVersionComparer, :zdistDifferencer]

		def initialize(mining)
			super(mining, :mtype) if mining != nil
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