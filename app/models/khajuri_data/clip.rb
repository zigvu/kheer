class Clip < ActiveRecord::Base

	before_destroy :destroy_mongo_documents, prepend: true

  belongs_to :video

	# Mock a has_many relationship with Mongoid models
	def localizations
		Localization.where(clip_id: self.id).order(frame_number: :asc)
	end

	def annotations
		Annotation.where(clip_id: self.id).order(frame_number: :asc)
	end

	private
    def destroy_mongo_documents
      Localization.where(clip_id: self.id).delete_all
      Annotation.where(clip_id: self.id).delete_all
    end
end
