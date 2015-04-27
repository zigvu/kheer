namespace :importexport do
  desc "Import video quanta data for a particular video collection"
  task import_video: :environment do
    videoCollectionId = ENV['video_collection_id']
    chiaVersionId = ENV['chia_version_id']
    scoreFolder = ENV['json_folder']
    videoFile = ENV['video_file']

    if (videoCollectionId == nil) or (chiaVersionId == nil) or (scoreFolder == nil) or (videoFile == nil)
      puts "Usage: rake importexport:import_video video_collection_id=<id> chia_version_id=<id> json_folder=<folder> video_file=<mp4file>"
      puts "Exiting"
    else
      vidCol = ::VideoCollection.find(videoCollectionId.to_i)
      chiaVersion = ::ChiaVersion.find(chiaVersionId.to_i)
      puts "Reading JSON folder"
      folderReader = DataImporters::ScoreFolderReader.new(scoreFolder)
      puts "Creating new video db object"
      video = DataImporters::ImportVideoFile.new(folderReader, vidCol, videoFile).create()
      puts "Saving scores to mongo"
      importScoreFolder = DataImporters::ImportScoreFolder.new(folderReader, video, chiaVersion)
      importScoreFolder.saveToDb()
      puts "Done importing video. New video ID: #{video.id}"
    end
  end

  desc "Export annotations associated with a particular chia version id"
  task export_annotation: :environment do
    chiaVersionId = ENV['chia_version_id']
    outputFolder = ENV['output_folder']
    if (chiaVersionId == nil) or (outputFolder == nil)
      puts "Usage: rake importexport:export_annotation chia_version_id=<id> output_folder=<folder>"
      puts "Exiting"
    else
      puts "Start exporting annotations"
      ea = DataExporters::ExportAnnotations.new(chiaVersionId.to_i, outputFolder)
      ea.export()
      puts "Done exporting annotations"
    end
  end

end
