<template>
	<v-row justify="center">
		<v-dialog
		v-model="dialog"
		persistent
		max-width="600px"
		>
		<v-card>
			<v-card-title>
			<span class="text-h5">ユーザー登録</span>
			</v-card-title>
			<v-card-text>
			<v-container>
				<v-row>
				<v-col
					cols="12"
				>
					<v-text-field
						v-model="username"
						:error-messages="usernameErrors"
						:counter="15"
						label="ユーザー名"
						required
						@input="$v.username.$touch()"
						@blur="$v.username.$touch()"
						prepend-icon="mdi-account-circle"
					></v-text-field>
				</v-col>
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
				<v-col cols="12">
					<v-text-field
						v-model="confirmPassword"
						:error-messages="confirmPasswordErrors"
						label="パスワード確認"
						v-bind:type="showConfirmPassword ? 'text' : 'password'"
						@click:append="showConfirmPassword = !showConfirmPassword"
						required
						@input="$v.confirmPassword.$touch()"
						@blur="$v.confirmPassword.$touch()"
						prepend-icon="mdi-lock-outline"
						v-bind:append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" 
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
				ログイン画面へ
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn
				color="primary"
				@click="registerUser"
				:disabled="this.$v.$invalid"
			>
				登録
			</v-btn>
			</v-card-actions>
		</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
import { auth } from '../firebase/index';
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, email, alphaNum, sameAs } from 'vuelidate/lib/validators'

export default {
	name: 'RegisterForm',
	mixins: [validationMixin],

	validations: {
		username: {
			required,
			maxLength: maxLength(15)
		},
		email: {
			required, 
			email
		},
		password: {
			required,
			minLength: minLength(6),
			alphaNum
		},
		confirmPassword: {
			required,
			sameAsPassword: sameAs('password')
		}
	},

	data() {
		return {
			dialog: true,
			showPassword: false,
			showConfirmPassword: false,
			username: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	},

	computed: {
		usernameErrors () {
			const errors = []
			if (!this.$v.username.$dirty) return errors
			!this.$v.username.maxLength && errors.push('ユーザー名は15文字以内で入力してください')
			!this.$v.username.required && errors.push('ユーザー名は必須です')
			return errors
		},
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
		confirmPasswordErrors() {
			const errors = []
			if (!this.$v.confirmPassword.$dirty) return errors
			!this.$v.confirmPassword.required && errors.push('パスワード確認は必須です')
			!this.$v.confirmPassword.sameAsPassword && errors.push('パスワードと一致していません')
			return errors
		}
	},

	methods: {
		registerUser() {
			this.$v.$touch();
			if(this.$v.$invalid) {
				console.log('Validation error');
			} else {
				if(this.password === this.confirmPassword) {
					auth.createUserWithEmailAndPassword(this.email, this.password)
						.then((result) => {
							result.user.updateProfile({
								displayName: this.username
							})
						})
						.catch(function(error) {
							const errorCode = error.code;
							const errorMessage = error.message;
							console.log(errorCode, errorMessage)
						});
				}
			}
			this.$router.push({ name: 'LoginForm' })
		},
	},
}
</script>
