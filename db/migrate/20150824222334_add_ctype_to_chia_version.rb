class AddCtypeToChiaVersion < ActiveRecord::Migration
  def change
    add_column :chia_versions, :ctype, :string
  end
end
