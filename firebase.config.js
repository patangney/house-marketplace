// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFireStore} from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlEfpTlXu1RsCP8TCwjUbAdW7zp166HQM",
  authDomain: "house-marketplace-app-56146.firebaseapp.com",
  projectId: "house-marketplace-app-56146",
  storageBucket: "house-marketplace-app-56146.appspot.com",
  messagingSenderId: "722217092674",
  appId: "1:722217092674:web:b29c0c52d1e153e481cfdb",
  measurementId: "G-TZTRR9N4K9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFireStore()