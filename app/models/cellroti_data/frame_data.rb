class CellrotiData::FrameData
  include Her::Model

  def self.getFrameNumbers(cellrotiVideoIds)
    paramHash = {}
    paramHash['video_ids'] = cellrotiVideoIds.to_s[1..-2].delete(' ')

    # format
    # {cellroti_video_id: [frame_number, ], }
    frameNumbersMap = {}
    self.where(paramHash).each do |fd|
      frameNumbersMap[fd.video_id] = fd.frame_numbers
    end
    frameNumbersMap
  end

  def self.sendFrameData(cellViFnMap)
    paramHash = {}
    paramHash['files'] = {}
    # filetypes in app/data_exporters/save_for_cellroti_export.rb
    cellViFnMap.each do |cellrotiVideoId, gzipFileName|
      paramHash['files'][cellrotiVideoId] = Faraday::UploadIO.new(
        gzipFileName, 'application/octet-stream')
    end

    response = self.create(paramHash)

    success = true
    message = "Sent Frame data to cellroti"
    begin
      message = response.error
      success = false
    rescue
    end
    return success, message
  end
end
