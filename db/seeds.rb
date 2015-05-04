require 'fileutils'

# clear memcached
Rails.cache.clear


# imports
load 'app/seed_helpers/intake_detectable_list.rb'
load 'app/data_importers/create_patch_maps.rb'
load 'app/data_importers/import_score_folder.rb'

# data files
kheerSeed = Rails.root.join('public','data','kheerSeed').to_s
logoListFile =  "#{kheerSeed}/logo_list.csv"
patchMapFile = "#{kheerSeed}/patch_map.json"
cellMapFile = "#{kheerSeed}/cell_map.json"
colorMapFile = "#{kheerSeed}/color_map.json"
scoreFolder = "#{kheerSeed}/json_for_kheer"
videoURL = "#{kheerSeed}/stitched_video_localized.mp4"

# so as not to re-create data each time, create copy that will
# get deleted after populating database
scoreFolderCopy = "#{kheerSeed}/json_for_kheer_copy"
videoURLCopy = "#{kheerSeed}/stitched_video_localized_copy.mp4"
FileUtils.mkdir_p(scoreFolderCopy)
FileUtils.cp_r("#{scoreFolder}/.", scoreFolderCopy)
FileUtils.cp(videoURL, videoURLCopy)


# Create chia version, detectables and patch map
firstChiaVersion = ChiaVersion.create(name: "50 Class: Seed Model", description: "Using data annotated outside of kheer", comment: "Seed model after negative mining of annotated patches")
chiaSerializer = Serializers::ChiaVersionSettingsSerializer.new(firstChiaVersion)
chiaSerializer.addSettingsZdistThresh([0, 1.5, 2.5, 4.5])
chiaSerializer.addSettingsScales([0.4, 0.7, 1.0, 1.3, 1.6])

idl = SeedHelpers::IntakeDetectableList.new(logoListFile)
idl.saveToDb(firstChiaVersion.id)

pmf = DataImporters::CreateMaps.new(patchMapFile, cellMapFile, colorMapFile)
pmf.saveToDb(firstChiaVersion.id)

# Create users
zigvuAdmin = User.create(email: "zigvu_admin@zigvu.com", password: "abcdefgh", password_confirmation: 'abcdefgh')

# Create video data
firstVideoCollection = VideoCollection.create(title: "Stitched VIdeo", description: "Sticthed video test", comment: "Video from stitching frames from training data", source_type: "zigvu", source_url: "http://zigvu.com", quality: "High", format: "mp4", playback_frame_rate: 25.0, detection_frame_rate: 5.0, width: 1280, height: 720)
scoreFolderReader = DataImporters::ScoreFolderReader.new(scoreFolderCopy)
firstVideo = DataImporters::ImportVideoFile.new(scoreFolderReader, firstVideoCollection, videoURLCopy).create()
importScoreFolder = DataImporters::ImportScoreFolder.new(scoreFolderReader, firstVideo, firstChiaVersion)
importScoreFolder.saveToDb()

# create second chia version for annotation
secondChiaVersion = ChiaVersion.create(name: "50 Class: First retrain", description: "First round of annotation", comment: "Used only stitched video for annotation")
chiaSerializer = Serializers::ChiaVersionSettingsSerializer.new(secondChiaVersion)
chiaSerializer.addSettingsZdistThresh([0, 1.5, 2.5, 4.5])
chiaSerializer.addSettingsScales([0.4, 0.7, 1.0, 1.3, 1.6])

idl = SeedHelpers::IntakeDetectableList.new(logoListFile)
idl.saveToDb(secondChiaVersion.id)

pmf = DataImporters::CreateMaps.new(patchMapFile, cellMapFile, colorMapFile)
pmf.saveToDb(secondChiaVersion.id)

