namespace :importexport do
  desc "Import video quanta data for a particular video collection"
  task import_video: :environment do
    puts "Deprecated: Please use python executables for this task"
  end


  desc "Import annotations associated with a particular chia version id"
  task import_annotation: :environment do
    chiaVersionId = ENV['chia_version_id']
    annotationFolder = ENV['annotation_folder']
    if (chiaVersionId == nil) or (annotationFolder == nil)
      puts "Usage: rake importexport:import_annotation chia_version_id=<id> annotation_folder=<folder>"
      puts "Note: Currently, only annotations exported from kheer can be imported"
      puts "Warning: This WILL NOT overwrite any annotation already present in database"
      puts "Exiting"
    else
      puts "Start importing annotations"
      chiaVersion = ::ChiaVersion.find(chiaVersionId.to_i)
      puts "Reading JSON folder"
      folderReader = DataImporters::AnnotationFolderReader.new(annotationFolder)
      puts "Saving annotations to mongo"
      importAnnotationFolder = DataImporters::ImportAnnotationFolder.new(folderReader, chiaVersion)
      importAnnotationFolder.saveToDb()
      puts "Done importing annotations"
    end
  end


  desc "Import detectable list associated with a particular chia version id"
  task import_detectable: :environment do
    chiaVersionId = ENV['chia_version_id']
    detectableFile = ENV['detectable_file']
    if (chiaVersionId == nil) or (detectableFile == nil)
      puts "Usage: rake importexport:import_detectable chia_version_id=<id> detectable_file=<file>"
      puts "Warning: This WILL create new detectables even if already present in database"
      puts "Exiting"
    else
      puts "Start importing detectable list"
      chiaVersion = ::ChiaVersion.find(chiaVersionId.to_i)
      intaker = SeedHelpers::IntakeDetectableList.new(detectableFile)
      intaker.saveToDb(chiaVersion.id)
      puts "Done importing detectable list"
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


  desc "Export annotations associated with a particular chia version id for chia"
  task export_annotation_for_chia: :environment do
    chiaVersionId = ENV['chia_version_id']
    outputFolder = ENV['output_folder']
    avoidLabel = ENV['avoid_label']
    if (chiaVersionId == nil) or (outputFolder == nil) or (avoidLabel == nil)
      puts "Usage: rake importexport:export_annotation_for_chia chia_version_id=<id> output_folder=<folder> avoid_label=<label>"
      puts "Exiting"
    else
      puts "Start exporting annotations"
      ea = DataExporters::ExportAnnotationsForChia.new(chiaVersionId.to_i, outputFolder, avoidLabel)
      ea.export()
      puts "Done exporting annotations"
    end
  end


  desc "Import patch bucket folder"
  task import_patch_bucket_folder: :environment do
    inputFolder = ENV['input_folder']
    if (inputFolder == nil)
      puts "Usage: rake importexport:import_patch_bucket_folder input_folder=<folder>"
      puts "Exiting"
    else
      puts "Start importing patch bucket folder"
      ipbf = DataImporters::ImportPatchBucketFolder.new(inputFolder)
      ipbf.saveToDb()
      puts "Done importing patch bucket folder"
    end
  end


  desc "Import patch scores"
  task import_patch_scores: :environment do
    scoreFile = ENV['score_file']
    chiaVersionIdMajor = ENV['chia_version_id_major']
    chiaVersionIdMinor = ENV['chia_version_id_minor']
    if (scoreFile == nil) or (chiaVersionIdMajor == nil) or (chiaVersionIdMinor == nil)
      puts "Usage: rake importexport:import_patch_scores score_file=<scoreFile.csv> chia_version_id_major=<id> chia_version_id_minor=<id>"
      puts "Exiting"
    else
      puts "Start importing score file"
      ips = DataImporters::ImportPatchScores.new(
        chiaVersionIdMajor.to_i,
        chiaVersionIdMinor.to_i,
        scoreFile
      )
      ips.saveToDb
      puts "Done importing score file"
    end
  end

end
