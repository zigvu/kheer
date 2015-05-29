class ChiaVersion < ActiveRecord::Base
	serialize :settings, Hash
	after_create :initialize_settings

	has_many :chia_version_detectables, dependent: :destroy

	before_destroy :destroy_mongo_documents, prepend: true

	# Mock a has_many relationship with Mongoid models
	def color_map
		return ColorMap.where(chia_version_id: self.id).first
	end

	def cell_map
		return CellMap.where(chia_version_id: self.id).first
	end

	private
    def destroy_mongo_documents
      ColorMap.destroy_all(chia_version_id: self.id)
      CellMap.destroy_all(chia_version_id: self.id)
    end

    def initialize_settings
      Serializers::ChiaVersionSettingsSerializer.new(self).resetSettings
    end
end
