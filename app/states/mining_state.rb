module States
	# States:
	# new - brand new mining session
	# completeSetup - set up is complete
	# working - analyst is working on mining session
	# completeWorking - analyst finished working on session
	# deleted - all secondary data for this session can be reclaimed
	class MiningState < States::StateCommon

		@@possibleStates = [:new, :completeSetup, :working, :completeWorking, :deleted]

		def initialize(mining)
			super(mining, :state)
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
			# State strings
			define_method("#{ss}") do
				return ss.to_s
			end
		end

	end
end