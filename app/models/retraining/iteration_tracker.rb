class IterationTracker
  include Mongoid::Document

  field :di, as: :detectable_id, type: Integer

  # track patches
  # since filename will have a dot, they cannot be used as mongo hash keys,
  # hence, use two arrays to track
  # format:
  # {patches: [patchArray], counts: [countArray]}
  field :pap, as: :patches_parents, type: Hash
  field :pas, as: :patches_self, type: Hash
  field :par, as: :patches_parents_removal, type: Hash

  def getPatchesParents
    return nil if self.patches_parents == nil
    arraysToHash(self.patches_parents[:patches], self.patches_parents[:counts])
  end
  def setPatchesParents(hKeyVal)
    arrKey, arrVal = hashToArrays(hKeyVal)
    self.update(patches_parents: {patches: arrKey, counts: arrVal})
  end

  def getPatchesSelf
    return nil if self.patches_self == nil
    arraysToHash(self.patches_self[:patches], self.patches_self[:counts])
  end
  def setPatchesSelf(hKeyVal)
    arrKey, arrVal = hashToArrays(hKeyVal)
    self.update(patches_self: {patches: arrKey, counts: arrVal})
  end

  def getPatchesParentsRemoval
    return nil if self.patches_parents_removal == nil
    arraysToHash(self.patches_parents_removal[:patches], self.patches_parents_removal[:counts])
  end
  def setPatchesParentsRemoval(hKeyVal)
    arrKey, arrVal = hashToArrays(hKeyVal)
    self.update(patches_parents_removal: {patches: arrKey, counts: arrVal})
  end

  def hashToArrays(hKeyVal)
    return hKeyVal.keys, hKeyVal.values
  end

  def arraysToHash(arrKey, arrVal)
    Hash[arrKey.each_with_index.map{ |k, idx| [k, arrVal[idx]] }]
  end

  belongs_to :iteration
end
