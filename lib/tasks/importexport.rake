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
    iterationId = ENV['iteration_id']
    inputFolder = ENV['combined_input_folder']
    if (iterationId == nil) or (inputFolder == nil)
      puts "Usage: rake importexport:import_patch_bucket_folder iteration_id=<id> combined_input_folder=<folder>"
      puts "Exiting"
    else
      puts "Start importing patch bucket folder"
      ipbf = DataImporters::ImportPatchBucketFolders.new(iterationId, inputFolder)
      ipbf.saveToDb()
      puts "Done importing patch bucket folder"
    end
  end


  desc "Export patch list for retraining"
  task export_patch_list_for_retraining: :environment do
    iterationId = ENV['iteration_id']
    outputFile = ENV['output_file']
    if (iterationId == nil) or (outputFile == nil)
      puts "Usage: rake importexport:export_patch_list_for_retraining iteration_id=<id> output_file=<outputFile.json>"
      puts "Exiting"
    else
      puts "Start exporting patch list"
      de = DataExporters::ExportPatchNamesForRetraining.new(iterationId, outputFile)
      de.export
      puts "Done exporting patch list"
    end
  end

  desc "Export patch list for quality assurance"
  task export_patch_list_for_qa: :environment do
    iterationId = ENV['iteration_id']
    outputFolder = ENV['output_folder']
    if (iterationId == nil) or (outputFolder == nil)
      puts "Usage: rake importexport:export_patch_list_for_qa iteration_id=<id> output_folder=<folder>"
      puts "Exiting"
    else
      puts "Start exporting patch list for quality assurance"
      de = DataExporters::ExportPatchNamesForQa.new(iterationId, outputFolder)
      de.export
      puts "Done exporting patch list"
    end
  end

end
