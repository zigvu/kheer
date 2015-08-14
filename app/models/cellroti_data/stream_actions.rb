# define common actions for all stream objects
class CellrotiData::StreamActions
  include Her::Model

  def self.findObj(streamObj)
    raise "Cellroti ID not found" if streamObj.cellroti_id == nil
    self.find(streamObj.cellroti_id)
  end

  def self.deleteObj(streamObj)
    raise "Cellroti ID not found" if streamObj.cellroti_id == nil
    self.destroy_existing(streamObj.cellroti_id)
  end

  def self.synch(streamObj, extraParamsHash)
    paramHash = Hash[@streamObjAttr.map{ |f| [f, streamObj.send(f)] }]
    paramHash.merge!(extraParamsHash)

    if streamObj.cellroti_id == nil
      self.createFrom(streamObj, paramHash)
    else
      self.updateFrom(streamObj, paramHash)
    end
    streamObj
  end

  def self.createFrom(streamObj, paramHash)
    response = self.create(paramHash)
    streamObj.update(cellroti_id: response.id)
  end
  def self.updateFrom(streamObj, paramHash)
    raise "Cellroti ID not found" if streamObj.cellroti_id == nil
    self.save_existing(streamObj.cellroti_id, paramHash)
  end
end
