class AddSettingsToChiaVersion < ActiveRecord::Migration
  def change
    add_column :chia_versions, :settings, :string
  end
end
