# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150807000403) do

  create_table "channel_videos", force: true do |t|
    t.integer  "channel_id"
    t.integer  "video_id"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "channel_videos", ["channel_id"], name: "index_channel_videos_on_channel_id", using: :btree
  add_index "channel_videos", ["video_id"], name: "index_channel_videos_on_video_id", using: :btree

  create_table "channels", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "url"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "chia_version_detectables", force: true do |t|
    t.integer  "chia_version_id"
    t.integer  "detectable_id"
    t.integer  "chia_detectable_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "chia_version_detectables", ["chia_version_id"], name: "index_chia_version_detectables_on_chia_version_id", using: :btree
  add_index "chia_version_detectables", ["detectable_id"], name: "index_chia_version_detectables_on_detectable_id", using: :btree

  create_table "chia_versions", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.text     "comment"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "settings"
  end

  create_table "clips", force: true do |t|
    t.integer  "length"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "video_id"
    t.string   "clip_url"
    t.integer  "frame_number_start"
    t.integer  "frame_number_end"
  end

  add_index "clips", ["video_id"], name: "index_clips_on_video_id", using: :btree

  create_table "delayed_jobs", force: true do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "detectables", force: true do |t|
    t.string   "name"
    t.string   "pretty_name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "event_types", force: true do |t|
    t.text     "description"
    t.float    "weight"
    t.integer  "sport_id"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "detectable_id"
  end

  add_index "event_types", ["detectable_id"], name: "index_event_types_on_detectable_id", using: :btree
  add_index "event_types", ["sport_id"], name: "index_event_types_on_sport_id", using: :btree

  create_table "game_teams", force: true do |t|
    t.integer  "game_id"
    t.integer  "team_id"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "game_teams", ["game_id"], name: "index_game_teams_on_game_id", using: :btree
  add_index "game_teams", ["team_id"], name: "index_game_teams_on_team_id", using: :btree

  create_table "game_videos", force: true do |t|
    t.integer  "game_id"
    t.integer  "video_id"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "game_videos", ["game_id"], name: "index_game_videos_on_game_id", using: :btree
  add_index "game_videos", ["video_id"], name: "index_game_videos_on_video_id", using: :btree

  create_table "games", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "start_date"
    t.string   "venue_city"
    t.string   "venue_stadium"
    t.integer  "sub_season_id"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "games", ["sub_season_id"], name: "index_games_on_sub_season_id", using: :btree

  create_table "leagues", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "sport_id"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "leagues", ["sport_id"], name: "index_leagues_on_sport_id", using: :btree

  create_table "seasons", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "league_id"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "seasons", ["league_id"], name: "index_seasons_on_league_id", using: :btree

  create_table "sports", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sub_seasons", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "season_id"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sub_seasons", ["season_id"], name: "index_sub_seasons_on_season_id", using: :btree

  create_table "teams", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "icon_path"
    t.integer  "league_id"
    t.integer  "cellroti_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "teams", ["league_id"], name: "index_teams_on_league_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "authentication_token"
  end

  add_index "users", ["authentication_token"], name: "index_users_on_authentication_token", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "videos", force: true do |t|
    t.text     "title"
    t.text     "description"
    t.text     "comment"
    t.string   "source_type"
    t.string   "source_url"
    t.string   "quality"
    t.string   "format"
    t.float    "playback_frame_rate"
    t.float    "detection_frame_rate"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
