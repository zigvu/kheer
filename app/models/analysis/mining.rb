class Mining
  include Mongoid::Document
	
	# meta data for indexing
	# -------------------------------------------
	field :nm, as: :name, type: String
	field :ds, as: :description, type: String
	field :ui, as: :user_id, type: Integer
	field :st, as: :state, type: String

	# mining setup
	# -------------------------------------------
	field :cil, as: :chia_version_id_loc, type: Integer
	field :cia, as: :chia_version_id_anno, type: Integer
	field :vis, as: :video_ids, type: Array

	# format:
	# {detId: zDistSelected, }
	# where zDistSelected = -1 if ignore in query
	field :zt, as: :zdist_threshs, type: Hash
	# format
	# {setId: [{video_id:, :clip_id, :loc_count, fn_count:, fn_visited_count:}, ]}
	field :cs, as: :clip_sets, type: Hash

	# index for faster traversal during ordering
	# -------------------------------------------
	index({ user_id: 1 }, { background: true })

	# convenience methods
	# -------------------------------------------

	def user
		return User.find(self.user_id)
	end

	def chiaVersionLoc
		return ChiaVersion.find(self.chia_version_id_loc)
	end

	def chiaVersionAnno
		return ChiaVersion.find(self.chia_version_id_anno)
	end

end
