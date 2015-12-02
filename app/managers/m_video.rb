require 'fileutils'

module Managers
	class MVideo
		def initialize(video)
			@video = video
			# configReader = States::ConfigReader.new
			@baseFolder = Rails.root.join("public","data","#{@video.id}").to_s
		end

		def get_export_folder(cellrotiExportId)
			exportFolder = "#{@baseFolder}/exports/#{cellrotiExportId}"
			FileUtils.mkdir_p(exportFolder)
			exportFolder
		end

		def get_cellroti_frame_folder(cellrotiVideoId)
			"/sftp/sftpuser/uploads/#{cellrotiVideoId}"
		end

		def delete_export_folder(cellrotiExportId)
			FileUtils.rm_rf(get_export_folder(cellrotiExportId))
		end
	end
end
