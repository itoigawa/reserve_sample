<template>
	<v-col cols="8">
		<!-- 目的セレクター -->
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
						:allowed-hours="allowed-hours"
						min="9:00"
						:max="endTime"
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
						:allowed-hours="allowed-hours"
						:min="startTime"
						max="18:00"
					></v-time-picker>
				</v-menu>

			</v-row>
		</div>
		<br>
		<br>
		<v-row class="justify-end">
			<v-btn
				class="mr-8"
				color="primary"
				elevation="2"
				@click="reserveRoom"
				:disabled="this.$v.$invalid"
			>予約</v-btn>
		</v-row>
	</v-col>
</template>

<script>
export default {
	name: 'FormSelect',
}
</script>
