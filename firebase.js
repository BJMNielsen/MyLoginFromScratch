// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDU7URfr9ZcDj7uNTi9tQNYnrhvKNGNDUA",
    authDomain: "notesproject-133b0.firebaseapp.com",
    projectId: "notesproject-133b0",
    storageBucket: "notesproject-133b0.appspot.com",
    messagingSenderId: "901694126411",
    appId: "1:901694126411:web:ebfc15c1054fed4cfc10ce"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export { database, app }
