module Serializers
	class ChiaVersionSettingsSerializer < Serializers::FieldSerializer
		# For each user_setting field, there is a single array row
		# First value in a field array row is the name of the field
		# Second value in a field array row is an array of things it holds
		@@chiaVersionSettingsFieldValues = [
			[:settings, [:zdistThresh]]
		]

		def initialize(chiaVersion)
			super(chiaVersion, @@chiaVersionSettingsFieldValues)
		end

		def resetSettings
			setDefaultField(:settings)
		end

		# No way to share class variables in Ruby - so duplicate
		# Meta programming to create commonly used methods
		@@chiaVersionSettingsFieldValues.each do |fv|
			field = fv[0]
			methodNames = fv[1]
			methodNames.each do |mn|
				fieldName = field.slice(0,1).capitalize + field.slice(1..-1)
				methodName = mn.slice(0,1).capitalize + mn.slice(1..-1)

				# Getter methods: Example: getSelectionsCampaigns
				define_method("get#{fieldName}#{methodName}") do
					getX(field, mn)
				end

				# Adder methods: Example: addSelectionsCampaigns
				define_method("add#{fieldName}#{methodName}") do |argument|
					addX(field, mn, argument)
				end

				# Remover methods: Example: removeSelectionsCampaigns
				define_method("remove#{fieldName}#{methodName}") do |argument|
					removeX(field, mn, argument)
				end

				# Replacer methods: Example: replaceSelectionsCampaigns
				define_method("replace#{fieldName}#{methodName}") do |argument|
					resetX(field, mn)
					addX(field, mn, argument)
				end

				# Resetter methods: Example: resetSelectionsCampaigns
				define_method("reset#{fieldName}#{methodName}") do
					resetX(field, mn)
				end
			end
		end
	end
end