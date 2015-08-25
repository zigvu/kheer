class AddDtypeToDetectable < ActiveRecord::Migration
  def change
    add_column :detectables, :dtype, :string
  end
end
