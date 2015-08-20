module States
	# States:
	# new - new export session
	# completeSetup - set up is complete
	# sentData - all JSON data has been sent to cellroti
	# waitingForFrameIds - kheer is waiting for ids of frames to extract
	# receivedFrameIds - cellroti sent frame ids to kheer
	# sendingFrames - kheer is connected to cellroti and is sending frames
	# sentFrames - all frames have been sent to cellroti
	# complete - export is complete
	# archived - this session is archived and all associated data been deleted
	class CellrotiExportState < States::StateCommon

		@@possibleStates = [:new, :completeSetup, :sentData, :waitingForFrameIds, 
			:receivedFrameIds, :sendingFrames, :sentFrames, :complete, :archived]

		def initialize(cellrotiExport)
			super(cellrotiExport, :state) if cellrotiExport != nil
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

	end
end