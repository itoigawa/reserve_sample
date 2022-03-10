import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import './firebase/index';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';

Vue.config.productionTip = false;

Vue.use(Vuelidate);

// const firebaseConfig = {
// 	apiKey: "AIzaSyC3lwQ2c1TkaQKcIIR6KcagFvInZFOWeT0",
// 	authDomain: "reserve-sample-36e45.firebaseapp.com",
// 	databaseURL: "https://reserve-sample-36e45-default-rtdb.firebaseio.com",
// 	projectId: "reserve-sample-36e45",
// 	storageBucket: "reserve-sample-36e45.appspot.com",
// 	messagingSenderId: "95957264864",
// 	appId: "1:95957264864:web:49d2e5999d89e8556b6385"
// };

// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
// export default db;

new Vue({
	router,
	vuetify,
	render: h => h(App)
}).$mount('#app')
