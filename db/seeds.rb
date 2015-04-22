# clear memcached
Rails.cache.clear


# imports
load 'app/seed_helpers/intake_detectable_list.rb'
load 'app/data_importers/create_patch_maps.rb'
load 'app/data_importers/import_score_folder.rb'

# data files
logoListFile = '/home/evan/Vision/temp/kheerSeed/logo_list.csv'
patchMapFile = '/home/evan/Vision/temp/kheerSeed/patch_map.json'
scoreFolder = '/home/evan/Vision/temp/kheerSeed/json_for_kheer'


# Create chia version, detectables and patch map
firstChiaVersion = ChiaVersion.create(name: "50 Class Seed Model", description: "First train description", comment: "First train comment")
chiaSerializer = Serializers::ChiaVersionSettingsSerializer.new(firstChiaVersion)
chiaSerializer.addSettingsZdistThresh([0, 1.5, 2.5, 4.5])

idl = SeedHelpers::IntakeDetectableList.new(logoListFile)
idl.saveToDb(firstChiaVersion.id)

pmf = DataImporters::CreatePatchMaps.new(patchMapFile)
pmf.saveToDb(firstChiaVersion.id)

# Create users
zigvuAdmin = User.create(email: "zigvu_admin@zigvu.com", password: "abcdefgh", password_confirmation: 'abcdefgh')

# Create video data
firstVideo = Video.create(title: "Stitched VIdeo", description: "Sticthed video test", comment: "Video from stitching frames from training data", source_type: "zigvu", source_url: "http://zigvu.com", quality: "High", format: "mp4", length: 318600, runstatus: "not-run", start_time: "2015-03-31 00:00:00", end_time: "2015-03-31 00:5:19", playback_frame_rate: 25.0, detection_frame_rate: 5.0, width: 1280, height: 720)
isf = DataImporters::ImportScoreFolder.new(scoreFolder, firstVideo.id, firstChiaVersion.id)
isf.saveToDb()

