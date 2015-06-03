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

ActiveRecord::Schema.define(version: 20150529173711) do

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

  create_table "detectables", force: true do |t|
    t.string   "name"
    t.string   "pretty_name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

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
