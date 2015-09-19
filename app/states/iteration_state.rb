module States
	# States:
	# new - brand new iteration
	# chiaVersionSet - chia version has been decided
	# scoresImported - scores have been imported
	# patchesSelected - patches selected for export
	# selecteionsConfirmed - patch selection confirmed
	# exportCompleted - export of patches has been complete
	# deleted - all secondary data for this session can be reclaimed
	class IterationState < States::StateCommon

		@@possibleStates = [:new, :chiaVersionSet, :scoresImported, :patchesSelected,
			:selectionsConfirmed, :exportCompleted, :deleted]

		def initialize(iteration)
			super(iteration, :state) if iteration != nil
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
			# Comparator method: Example: isBeforeDownloadQueue?
			define_method("isBefore#{methodName}?") do
				currentStateSym = getX.to_sym
				methodNameIdx = @@possibleStates.find_index(ss)
				currentStateSymIdx = @@possibleStates.find_index(currentStateSym)
				return methodNameIdx > currentStateSymIdx
			end
			# Comparator method: Example: isAfterDownloadQueue?
			define_method("isAfter#{methodName}?") do
				currentStateSym = getX.to_sym
				methodNameIdx = @@possibleStates.find_index(ss)
				currentStateSymIdx = @@possibleStates.find_index(currentStateSym)
				return methodNameIdx < currentStateSymIdx
			end
		end

		define_method("getAllStates") do
			return @@possibleStates
		end

	end
end