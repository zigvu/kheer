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
end
