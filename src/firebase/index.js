import firebase from "firebase/compat/app"
import "firebase/compat/auth";
import 'firebase/compat/firestore';
import "firebase/compat/functions";
import "firebase/compat/storage";

const firebaseConfig = {
	apiKey: "AIzaSyC3lwQ2c1TkaQKcIIR6KcagFvInZFOWeT0",
	authDomain: "reserve-sample-36e45.firebaseapp.com",
	databaseURL: "https://reserve-sample-36e45-default-rtdb.firebaseio.com",
	projectId: "reserve-sample-36e45",
	storageBucket: "reserve-sample-36e45.appspot.com",
	messagingSenderId: "95957264864",
	appId: "1:95957264864:web:49d2e5999d89e8556b6385"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();
export const storage = firebase.storage();
export const fb = firebase;
export const FirebaseFieldValue = firebase.firestore.FieldValue
export const FirebaseTimestamp = firebase.firestore.Timestamp;