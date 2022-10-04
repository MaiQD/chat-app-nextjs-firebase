import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: "chat-104fd.firebaseapp.com",
	projectId: "chat-104fd",
	storageBucket: "chat-104fd.appspot.com",
	messagingSenderId: "391473055562",
	appId: "1:391473055562:web:31c129ea262889cf45a3b3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();