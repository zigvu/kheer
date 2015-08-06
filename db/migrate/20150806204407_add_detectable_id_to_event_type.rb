class AddDetectableIdToEventType < ActiveRecord::Migration
  def change
    add_reference :event_types, :detectable, index: true
    remove_column :event_types, :name, :string
  end
end
