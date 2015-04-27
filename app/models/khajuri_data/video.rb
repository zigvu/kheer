class Video < ActiveRecord::Base

	before_destroy :destroy_mongo_documents, prepend: true

  belongs_to :video_collection

	# Mock a has_many relationship with Mongoid models
	def frame_scores
		FrameScore.where(video_id: self.id).order(frame_number: :asc)
	end

	def localizations
		Localization.where(video_id: self.id).order(frame_number: :asc)
	end

	def annotations
		Annotation.where(video_id: self.id).order(frame_number: :asc)
	end

	private
    def destroy_mongo_documents
      FrameScore.where(video_id: self.id).delete_all
      Localization.where(video_id: self.id).delete_all
      Annotation.where(video_id: self.id).delete_all
    end
end
