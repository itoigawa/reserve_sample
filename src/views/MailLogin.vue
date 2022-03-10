<template>
	<v-row justify="center">
		<v-dialog
		v-model="dialog"
		persistent
		max-width="600px"
		>
		<v-card>
			<v-card-title>
			<span class="text-h5">メールログイン</span>
			</v-card-title>
			<v-card-text>
			<v-container>
				<v-row>
					<v-col cols="12">
						<v-text-field
							v-model="email"
							:error-messages="emailErrors"
							label="メールアドレス"
							required
							@input="$v.email.$touch()"
							@blur="$v.email.$touch()"
							prepend-icon="mdi-email"
						></v-text-field>
					</v-col>
				</v-row>
			</v-container>
			</v-card-text>
			<v-card-actions>
			
			<v-btn
				color="blue darken-1"
				text
				to="/login"
			>
				戻る
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn
				color="primary"
				@click="mailLogin"
				:disabled="this.$v.$invalid"
			>
				送信
			</v-btn>
			</v-card-actions>
		</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
import { getAuth, signInWithEmailLink } from "firebase/auth";
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
	name: 'MailLogin',
	mixins: [validationMixin],

	validations: {
		email: {
			required,
			email
		},
	},

	data() {
		return {
			dialog: true,
			email: '',
		}
	},

	computed: {
		emailErrors () {
			const errors = []
			if (!this.$v.email.$dirty) return errors
			!this.$v.email.email && errors.push('有効なメールアドレスにしてください')
			!this.$v.email.required && errors.push('メールアドレスは必須です')
			return errors
		},
	},

	methods: {
		mailLogin() {
			const auth = getAuth();
			const email = this.email;
			signInWithEmailLink(auth, email)
				.then((result) => {
					console.log(result);
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.log(errorCode);
					console.log(errorMessage);
				});
			
		},
	},
}
</script>

<style>

</style>