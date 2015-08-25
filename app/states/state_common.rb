module States
	class StateCommon

	  cattr_accessor :possibleStates

		def initialize(tableObject, columnName)
			@tableObject = tableObject
			@columnName = columnName
		end

		# methods for sub classes
		def getX
			@tableObject.send(@columnName)
		end
		def setX(setValue)
			@tableObject.update({@columnName => setValue})
		end
	end
end
