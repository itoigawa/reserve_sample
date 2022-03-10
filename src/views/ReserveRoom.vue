<template>
<v-container v-if="authenticatedUser">
	<!-- モーダル -->
	<v-row justify="center">
		<v-dialog
		v-model="dialog"
		scrollable
		persistent
		max-width="300px"
		>
		<v-card>
			<v-card-title>会議室を選択</v-card-title>
			<v-divider></v-divider>
			<v-card-text style="height: 300px;">
			<v-radio-group
				v-model="roomNum"
				column
				mandatory
			>
				<v-radio
				label="会議室1"
				value="1"
				></v-radio>
				<v-radio
				label="会議室2"
				value="2"
				></v-radio>
			</v-radio-group>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
			<v-btn
				color="blue darken-1"
				text
				to="/"
			>
				ホーム
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn
				color="primary"
				@click="selectRoom"
			>
				次へ
			</v-btn>
			</v-card-actions>
		</v-card>
		</v-dialog>
	</v-row>
	<br>
	<br>
	<v-row>
		<!-- カレンダー -->
		<v-col cols="4">
			<v-sheet height="635" width="340">
				<v-calendar
					id="calendar"
					color="primary"
					type="day"
					:events="events"
					first-interval="8"
					interval-count="11"
				>
					<template v-slot:day-header="{ present }">
						<template
						v-if="present"
						class="text-center"
						>
						{{ roomName }}
						</template>
					</template>
				</v-calendar>
			</v-sheet>
		</v-col>
		<!-- 目的セレクター -->
		<v-col cols="8">
			<v-select
				:items="names"
				v-model="name"
				label="目的"
				dense
				outlined
				:error-messages="nameErrors"
				required
				@change="$v.name.$touch()"
				@blur="$v.name.$touch()"
			></v-select>
			<br>
			<!-- 日時フォーム -->
			<div>
				<v-row
					justify="space-around"
					align="center"
				>
					<v-menu
						ref="menu1"
						v-model="menu1"
						:close-on-content-click="false"
						:nudge-right="40"
						:return-value.sync="startTime"
						transition="scale-transition"
						offset-y
						max-width="350px"
						min-width="350px"
					>
						<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="startTime"
							label="開始時刻"
							prepend-icon="mdi-clock-time-four-outline"
							readonly
							v-bind="attrs"
							v-on="on"
						></v-text-field>
						</template>
						<v-time-picker
							v-model="startTime"
							elevation="15"
							:error-messages="startTimeErrors"
							required
							@input="$v.startTime.$touch()"
							@blur="$v.startTime.$touch()"
							v-if="menu1"
							full-width
							@click:minute="$refs.menu1.save(startTime)"
							min="9:00"
							:max="endTime"
							:allowed-minutes="allowedMinutes"
						></v-time-picker>
					</v-menu>

					<v-menu
						ref="menu2"
						v-model="menu2"
						:close-on-content-click="false"
						:nudge-right="40"
						:return-value.sync="endTime"
						transition="scale-transition"
						offset-y
						max-width="350px"
						min-width="350px"
					>
						<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="endTime"
							label="終了時刻"
							prepend-icon="mdi-clock-time-four-outline"
							readonly
							v-bind="attrs"
							v-on="on"
						></v-text-field>
						</template>
						<v-time-picker
							v-model="endTime"
							elevation="15"
							:error-messages="endTimeErrors"
							required
							@input="$v.endTime.$touch()"
							@blur="$v.endTime.$touch()"
							v-if="menu2"
							full-width
							@click:minute="$refs.menu2.save(endTime)"
							:min="startTime"
							max="18:00"
							:allowed-minutes="allowedMinutes"
						></v-time-picker>
					</v-menu>

				</v-row>
			</div>
			<v-row class="justify-end mt-9">
				<v-btn
					text
					color="primary"
					to="/"
				>ホームに戻る</v-btn>
				<v-spacer></v-spacer>
				<v-btn
					class="mr-8"
					color="primary"
					elevation="2"
					@click="reserveRoom"
					:disabled="this.$v.$invalid"
				>予約</v-btn>
			</v-row>
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import { auth, db, FirebaseTimestamp } from '../firebase/index';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import SelectRoomModal from '../components/parts/modal/SelectRoomModal.vue';
import Calendar from '../components/parts/Calendar.vue';
import FormSelect from '../components/parts/FormSelect.vue';

const schedulesRef = db.collection('schedules');

export default {
	name: 'ReserveRoom',
	components: {
		SelectRoomModal,
		Calendar,
		FormSelect
	},
	data() {
		return {
			events: [],
			colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green'],
			name: '',
			names: ['打ち合わせ', 'Web面談', '勉強会', '来客', 'その他'],
			times: [],
			displayTime: '',
			authenticatedUser: '',
			user_id: '',
			year: '',
			month: '',
			date: '',
			startTime: '',
			endTime: '',
			menu1: false,
			menu2: false,
			dialog: false,
			roomNum: '',
			roomName: ''
		}
	},

	created(){
		auth.onAuthStateChanged((user) => {
			if (user) {
				this.authenticatedUser = true;
				this.user_id = user.uid;
			} else {
				this.authenticatedUser = false;
				this.$router.push({ name: 'LoginForm' });
			}
		});

		this.openDialog();
	},

	mixins: [validationMixin],
	validations: {
		name: {
			required
		},
		startTime: {
			required
		},
		endTime: {
			required
		}
	},
	methods: {
		async getEvents() {
			let querySnapshot = await schedulesRef.where('room_num', '==', this.roomNum).get();
			let events = [];
			querySnapshot.forEach(doc => {
				let appData = doc.data();
				appData.id = doc.id;
				events.push(appData);
			})

			this.events = events;
		},
		reserveRoom() {
			this.$v.$touch();
			// validationがinvalidだったら
			if(this.$v.$invalid) {
				console.log('Validation error');
			} else {
				// 今日のDateオブジェクトを作成して、year, month, date を取得
				const now = new Date();
				const year = now.getFullYear();
				const month = now.getMonth() + 1;
				const date = now.getDate();
	
				// DateオブジェクトをYYYY-MM-DD hh:mmの形式に変更
				const start = year + '-' + month + '-' + date + ' ' + this.startTime;
				const end = year + '-' + month + '-' + date + ' ' + this.endTime;

				const timestamp = FirebaseTimestamp.now();

				const data = {
					id: '',
					user_id: this.user_id,
					room_num: this.roomNum,
					name: this.name,
					start: start,
					end: end,
					color: this.colors[this.names.indexOf(this.name)],
					updated_at: timestamp
				}

				if(data.id === '') {
					const ref = schedulesRef.doc();
					data.created_at = timestamp;
					const id = ref.id;
					data.id = id;
				}

				schedulesRef.doc(data.id).set(data, {merge: true})
					.then(function() {
						console.log("Document successfully written!");
					})
					.catch(function(error) {
						console.error("Error writing document: ", error);
					});

				this.getEvents();
				this.formClear();

	
				// schedulesRef
				// 	.add({
				// 		user_id: this.user_id,
				// 		room_num: this.roomNum,
				// 		name: this.name,
				// 		start: start,
				// 		end: end,
				// 		color: this.colors[this.names.indexOf(this.name)]
				// 	})
				// 	.then(function() {
				// 		console.log("Document successfully written!");
				// 	})
				// 	.catch(function(error) {
				// 		console.error("Error writing document: ", error);
				// 	});
	
				// this.getEvents();
				// this.formClear();





			//	const roomNum = this.roomNum;


			// 	db.collection('schedules')
			// 		.doc('conferenceRoom')
			// 		.collection(roomNum)
			// 		.add({
			// 			user_id: this.user_id,
			// 			room_num: this.roomNum,
			// 			name: this.name,
			// 			start: start,
			// 			end: end,
			// 			color: this.colors[this.names.indexOf(this.name)]
			// 		}, {merge: true})
			// 		.then(function() {
			// 			console.log("Document successfully written!");
			// 		})
			// 		.catch(function(error) {
			// 			console.error("Error writing document: ", error);
			// 		});
	
			// 	this.getEvents();
			// 	this.formClear();
			// }




			}
		},
		formClear() {
			this.$v.$reset()
			this.name = null
			this.startTime = ''
			this.endTime = ''
		},
		openDialog() {
			this.dialog = true;
		},
		selectRoom() {
			this.dialog = false;
			this.roomName = '会議室' + this.roomNum
			this.getEvents();
		},
		allowedMinutes: v => v % 5 === 0,
	},
	computed: {
		nameErrors () {
			const errors = []
			if (!this.$v.name.$dirty) return errors
			!this.$v.name.required && errors.push('目的を入力してください')
			return errors
		},
		startTimeErrors () {
			const errors = []
			if (!this.$v.startTime.$dirty) return errors
			!this.$v.startTime.required && errors.push('開始時刻を入力してください')
			return errors
		},
		endTimeErrors () {
			const errors = []
			if (!this.$v.endTime.$dirty) return errors
			!this.$v.endTime.required && errors.push('終了時刻を入力してください')
			return errors
		},
	}
}
</script>
