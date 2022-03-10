<template>
	<v-col cols="4">
			<v-sheet height="620" width="340">
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
</template>

<script>
export default {
	name: 'Calendar'
}
</script>
