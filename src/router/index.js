import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RegisterForm from '../views/RegisterForm.vue';
import LoginForm from '../views/LoginForm.vue';
import MailLogin from '../views/MailLogin.vue';
import ReserveRoom from '../views/ReserveRoom.vue';

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'HomeView',
		component: HomeView
	},
	{
		path: '/register',
		name: 'RegisterForm',
		component: RegisterForm
	},
	{
		path: '/login',
		name: 'LoginForm',
		component: LoginForm
	},
	{
		path: '/mail_login',
		name: 'MailLogin',
		component: MailLogin
	},
	{
		path: '/reserve_room',
		name: 'ReserveRoom',
		component: ReserveRoom
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
