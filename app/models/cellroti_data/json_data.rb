class CellrotiData::JsonData
  include Her::Model

  def self.sendJsonData(videoId, cellrotiGameId, cellrotiChannelId, videoFileNames)
    paramHash = {}
    paramHash['kheer_video_id'] = videoId
    paramHash['game_id'] = cellrotiGameId
    paramHash['channel_id'] = cellrotiChannelId
    # filetypes in app/data_exporters/save_for_cellroti_export.rb
    videoFileNames.each do |fileType, videoFileName|
      paramHash[fileType] = Faraday::UploadIO.new(
        videoFileName, 'application/octet-stream')
    end

    response = self.create(paramHash)

    success = true
    message = "Sent JSON data to cellroti"
    begin
      message = response.error
      success = false
    rescue
      message = response.cellroti_video_id.to_i
    end
    return success, message
  end
end
