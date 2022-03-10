<template>
	<v-row justify="center">
		<v-dialog
		v-model="dialog"
		persistent
		max-width="600px"
		>
		<v-card>
			<v-card-title>
			<span class="text-h5">ログイン</span>
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
					<v-col cols="12">
						<v-text-field
							v-model="password"
							:error-messages="passwordErrors"
							label="パスワード"
							v-bind:type="showPassword ? 'text' : 'password'"
							@click:append="showPassword = !showPassword"
							required
							@input="$v.password.$touch()"
							@blur="$v.password.$touch()"
							prepend-icon="mdi-lock"
							v-bind:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" 
						></v-text-field>
					</v-col>
				</v-row>
			</v-container>
			</v-card-text>
			<v-card-actions>
			
			<v-btn
				color="blue darken-1"
				text
				to="/register"
			>
				ユーザー登録画面へ
			</v-btn>
			<v-btn
				color="blue darken-1"
				text
				to="/mail_login"
			>
				パスワードを忘れた
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn
				color="primary"
				@click="loginUser"
				:disabled="this.$v.$invalid"
			>
				ログイン
			</v-btn>
			</v-card-actions>
		</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
import { auth } from '../firebase/index';
import { validationMixin } from 'vuelidate'
import { required, minLength, email, alphaNum } from 'vuelidate/lib/validators'

export default {
	name: 'LoginForm',
	mixins: [validationMixin],

	validations: {
		email: {
			required, email
		},
		password: {
			required,
			minLength: minLength(6),
			alphaNum
		},
	},

	data() {
		return {
			dialog: true,
			showPassword: false,
			email: '',
			password: '',
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
		passwordErrors() {
			const errors = []
			if (!this.$v.password.$dirty) return errors
			!this.$v.password.required && errors.push('パスワードは必須です')
			!this.$v.password.minLength && errors.push('パスワードは6文字以上で入力してください')
			!this.$v.password.alphaNum && errors.push('パスワードは半角英数字で入力してください')
			return errors
		},
	},

	methods: {
		loginUser() {
			auth.signInWithEmailAndPassword(this.email, this.password)
				.then(() => {
					this.$router.push({ name: 'HomeView' })
				})
				.catch(function(error) {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.log(errorCode);
					console.log(errorMessage);
				})
		},
		clear() {
			this.$v.$reset()
			this.email = ''
			this.password = ''
		},
	},
}
</script>
