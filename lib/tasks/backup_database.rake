require 'fileutils'
require 'yaml'

namespace :backupdatabases do

  desc "Export both mysql and mongo databases"
  task export_databases: :environment do
    outputFolder = ENV['output_folder']
    if (outputFolder == nil)
      puts "Usage: rake backupdatabases:export_databases output_folder=<folder>"
    else
      FileUtils.rm_rf(outputFolder)
      FileUtils.mkdir_p(outputFolder)

      puts "Start exporting mysql"
      sqlFile = File.join(outputFolder, 'mysql.dump')
      sqlDbConf = Rails.configuration.database_configuration[Rails.env]
      system "mysqldump -u #{sqlDbConf['username']} --add-drop-table --skip-lock-tables --verbose #{sqlDbConf['database']} > #{sqlFile}"
      puts "Finish exporting mysql"


      puts "Start exporting mongodb"
      mongoDbConf = YAML::load(IO.read(File.join(Rails.root, 'config', 'mongoid.yml')))[Rails.env]
      mongoDbName = mongoDbConf['sessions']['default']['database']
      system "mongodump -d #{mongoDbName} -o #{outputFolder}"
      puts "Finish exporting mongodb"
    end
  end

  desc "Import both mysql and mongo databases"
  task import_databases: :environment do
    sqlFile = ENV['mysql_file']
    mongoFolder = ENV['mongo_folder']
    if (sqlFile == nil) or (mongoFolder == nil)
      puts "Usage: rake backupdatabases:import_databases mysql_file=<mysql.dump> mongo_folder=<folder>"
    else
      raise "Cannot import to a production database. Bailing out..." if Rails.env == 'production'

      puts "Start importing mysql"
      sqlDbConf = Rails.configuration.database_configuration[Rails.env]
      system "rake db:drop && rake db:create"
      system "mysql -u #{sqlDbConf['username']} #{sqlDbConf['database']} < #{sqlFile}"
      system "rails db:migrate"
      puts "Finish importing mysql"


      puts "Start importing mongodb"
      mongoDbConf = YAML::load(IO.read(File.join(Rails.root, 'config', 'mongoid.yml')))[Rails.env]
      mongoDbName = mongoDbConf['sessions']['default']['database']
      # drop all values
      Mongoid.default_session.drop()
      system "mongorestore -d #{mongoDbName} #{mongoFolder}"
      puts "Finish importing mongodb"
    end
  end

end
