// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAr477pAVnhHRjyFlXLu-KO02eTy6DFE8",
  authDomain: "poststuff-cd9db.firebaseapp.com",
  projectId: "poststuff-cd9db",
  storageBucket: "poststuff-cd9db.appspot.com",
  messagingSenderId: "752247122764",
  appId: "1:752247122764:web:7b6b07ebc43227b59a7de9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new  GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);