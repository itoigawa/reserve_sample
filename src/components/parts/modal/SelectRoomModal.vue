<template>
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
				@click="selectRoom"
			>
				次へ
			</v-btn>
			</v-card-actions>
		</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
export default {
	name: 'SelectRoomModal',
	props: ['dialog']
}
</script>
