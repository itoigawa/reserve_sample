<template v-if="authenticatedUser">
	<v-container>
		<v-app-bar
			absolute
			color="primary"
			dark
			prominent
			height="100"
		>
		<v-app-bar-nav-icon></v-app-bar-nav-icon>

		<v-toolbar-title>会議室管理システム</v-toolbar-title>

		<v-spacer></v-spacer>

		<v-btn icon to="/reserve_room">
			<v-icon>mdi-calendar-check</v-icon>
		</v-btn>

		<v-btn icon @click="logoutUser">
			<v-icon>mdi-logout</v-icon>
		</v-btn>

		<v-btn icon>
			<v-icon>mdi-dots-vertical</v-icon>
		</v-btn>
		</v-app-bar>
		<v-sheet
		class="overflow-y-auto"
		>
			<br>
			<br>
			<v-container>
				<v-row class="fill-height">
					<v-col>
					<v-sheet height="64">
					</v-sheet>
					<v-sheet  height="645">
						<v-row>
							<v-col cols="6">
								<v-calendar
									id="calendar"
									color="primary"
									type="day"
									:events="events1"
									first-interval="8"
									interval-count="11"
									@click:event="showEvent"
								>
									<template v-slot:day-header="{ present }">
										<template
										v-if="present"
										class="text-center"
										>
										会議室1
										</template>
									</template>
								</v-calendar>
							</v-col>
							<v-col cols="6">
								<v-calendar
									id="calendar"
									color="primary"
									type="day"
									:events="events2"
									first-interval="8"
									interval-count="11"
									@click:event="showEvent"
								>
									<template v-slot:day-header="{ present }">
										<template
										v-if="present"
										class="text-center"
										>
										会議室2
										</template>
									</template>
								</v-calendar>
							</v-col>
						</v-row>
						</v-sheet>
					</v-col>
				</v-row>
			</v-container>
			<v-menu
				v-model="selectedOpen"
				:close-on-content-click="false"
				:activator="selectedElement"
				offset-x
				>
				<v-card
					color="grey lighten-4"
					min-width="350px"
					flat
				>
					<v-toolbar
						:color="selectedEvent.color"
						dark
					>
					<v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
					<v-spacer></v-spacer>
					</v-toolbar>
					<v-card-actions>
					<v-toolbar-title v-html="selectedEvent.details"></v-toolbar-title>
						<v-card-text>
							<v-form>
								<v-select
									:items="names"
									v-model="selectedEvent.name"
									label="目的"
									dense
									outlined
								></v-select>
								<v-text-field
									v-model="selectedEvent.start"
									type="text"
									label="開始時刻"
									style="width: 100%"
									:min-height="100"
								></v-text-field>
								<v-text-field
									v-model="selectedEvent.end"
									type="text"
									label="開始時刻"
									style="width: 100%"
									:min-height="100"
								></v-text-field>
							</v-form>
								<v-row class="justify-end mt-9">
									<v-btn
										text
										color="secondary"
										@click="selectedOpen = false"
										outlined
									>
										キャンセル
									</v-btn>
									<v-btn class="ml-2" color="error" @click="deleteEvent(selectedEvent)">削除</v-btn>
									<v-spacer></v-spacer>
									<v-btn color="success" @click.prevent="updateEvent(selectedEvent)">更新</v-btn>
								</v-row>
							</v-card-text>
					</v-card-actions>
				</v-card>
			</v-menu>
		</v-sheet>
	</v-container>
</template>

<script>
import {db, auth, FirebaseTimestamp} from '../firebase/index';

const schedulesRef = db.collection('schedules');

export default {
	name: 'HomeView',
	data() {
		return {
			user: '',
			authenticatedUser: false,
			events1: [],
			events2: [],
			selectedEvent: {},
			selectedElement: null,
			selectedOpen: false,
			colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green'],
			name: '',
			names: ['打ち合わせ', 'Web面談', '勉強会', '来客', 'その他'],
		}
	},
	created(){
		auth.onAuthStateChanged((user) => {
			if (user) {
				this.user = user;
				this.authenticatedUser = true;
			} else {
				this.authenticatedUser = false;
			}
		});
		this.getEvents1();
		this.getEvents2();
	},
	methods: {
		logoutUser(){
			auth.signOut()
				.then(() => {
					// auth.onAuthStateChanged((user) => {
					// 	if (user) {
					// 		this.user = user;
					// 		this.authenticatedUser = true;
					// 	} else {
					// 		this.authenticatedUser = false;
					// 	}
					// });
					// if(!user) {
						this.$router.push({ name: 'LoginForm' });
					// }
				})
				.catch((error) => {
					console.log(error);
				})
		},
		async getEvents1() {
			let snapshot = await schedulesRef.where('room_num', '==', '1').get();
			let events1 = [];
			snapshot.forEach(doc => {
				let appData = doc.data();
				appData.id = doc.id;
				events1.push(appData);
			})

			this.events1 = events1;
		},
		async getEvents2() {
			let snapshot = await schedulesRef.where('room_num', '==', '2').get();
			let events2 = [];
			snapshot.forEach(doc => {
				let appData = doc.data();
				appData.id = doc.id;
				events2.push(appData);
			})

			this.events2 = events2;
		},
		showEvent ({ nativeEvent, event }) {
			// ログインしているユーザーと予約したユーザーが一致していた場合
			if(this.user.uid === event.user_id) {
				const open = () => {
					this.selectedEvent = event
					this.selectedElement = nativeEvent.target
					requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
				}
	
				if (this.selectedOpen) {
				this.selectedOpen = false
					requestAnimationFrame(() => requestAnimationFrame(() => open()))
				} else {
					open()
				}
	
				nativeEvent.stopPropagation()
			}
		},
		async updateEvent(event){
			const timestamp = FirebaseTimestamp.now();

			try {

				await schedulesRef.doc(event.id).update({
					name: event.name,
					start: event.start,
					end: event.end,
					color: this.colors[this.names.indexOf(event.name)],
					updated_at: timestamp
				})

				this.selectedOpen = false;
				this.getEvents1();
				this.getEvents2();

			} catch (error) {
				console.log(error);
			}
		},
		async deleteEvent(event){
			const result = window.confirm('予約を削除してよろしいですか?');

			if(result) {
				try {
					await schedulesRef.doc(event.id).delete();
					this.selectedOpen = false;
					this.getEvents1();
					this.getEvents2();
				
				} catch (error) {
					console.log(error);
				}
			}
		},
	}
}
</script>