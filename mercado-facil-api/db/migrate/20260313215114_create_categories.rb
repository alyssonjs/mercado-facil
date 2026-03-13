class CreateCategories < ActiveRecord::Migration[7.2]
  def change
    create_table :categories do |t|
      t.references :store, null: false, foreign_key: true
      t.string :name, null: false
      t.string :slug, null: false
      t.boolean :active, default: true, null: false

      t.timestamps
    end
    add_index :categories, [:store_id, :slug], unique: true
  end
end
