class Video < ActiveRecord::Base
  before_destroy :destroy_mongo_documents, prepend: true

	has_many :clips, dependent: :destroy
  has_many :channel_videos, dependent: :destroy
  has_many :game_videos, dependent: :destroy
  # through relationships
  has_many :channels, through: :channel_videos
  has_many :games, through: :game_videos

  # Mock a has_many relationship with Mongoid models
  def localizations
    Localization.where(video_id: self.id).order(frame_number: :asc)
  end

  def annotations
    Annotation.where(video_id: self.id).order(frame_number: :asc)
  end

  private
    def destroy_mongo_documents
      Localization.where(video_id: self.id).delete_all
      Annotation.where(video_id: self.id).delete_all
    end
end
