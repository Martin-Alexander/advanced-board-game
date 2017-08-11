class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
      t.text :data
      t.boolean :player_one
      t.boolean :player_two

      t.timestamps
    end
  end
end
