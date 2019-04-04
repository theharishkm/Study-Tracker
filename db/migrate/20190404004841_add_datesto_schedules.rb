class AddDatestoSchedules < ActiveRecord::Migration[5.2]
  def change
    add_column :schedules,:dates,:date
  end
end
