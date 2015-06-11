require 'fileutils'

# clear memcached
Rails.cache.clear


# imports
load 'app/seed_helpers/intake_detectable_list.rb'
load 'app/data_importers/create_maps.rb'

# data files
kheerSeed = Rails.root.join('public','data','kheerSeed').to_s
logoListFile =  "#{kheerSeed}/logo_list.csv"
cellMapFile = "#{kheerSeed}/cell_map.json"
colorMapFile = "#{kheerSeed}/color_map.json"

# Create users
zigvuAdmin = User.create(email: "zigvu_admin@zigvu.com", password: "abcdefgh", password_confirmation: 'abcdefgh')

# Create chia version, detectables and patch map
firstChiaVersion = ChiaVersion.create(name: "50 Class: Seed Model", description: "Using data annotated outside of kheer", comment: "Seed model after negative mining of annotated patches")
chiaSerializer = Serializers::ChiaVersionSettingsSerializer.new(firstChiaVersion)
chiaSerializer.addSettingsZdistThresh([0, 2.0, 4.0])
chiaSerializer.addSettingsScales([0.4, 0.7, 1.0, 1.3, 1.6])

createdMaps = DataImporters::CreateMaps.new(cellMapFile, colorMapFile)
createdMaps.saveToDb(firstChiaVersion)

idl = SeedHelpers::IntakeDetectableList.new(logoListFile)
idl.saveToDb(firstChiaVersion.id)

# put in avoid class in detectable
avoidDet = Detectable.create(name: "_AVOID_", pretty_name: "_AVOID_", description: "")
firstChiaVersion.chia_version_detectables.create(detectable_id: avoidDet.id)

# create first video
video = Video.create(title: "Stitched Video", description: "Sticthed video test", comment: "Video from stitching frames from training data", source_type: "zigvu", source_url: "http://zigvu.com", quality: "High", format: "mp4", playback_frame_rate: 25.0, detection_frame_rate: 5.0, width: 1280, height: 720)

