### users
	id
	name
	email
	password

### schedules
	id
	room_num
	user_id
	start
	end
	color
	name
	timestamp


## サブコレクション
### schedules
	conferenceRoom
		room_num
			id
			user_id
			start
			end
			color
			name
			timestamp


