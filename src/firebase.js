// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6O8hf6hfH9joOvVkGwFSqmjEP0YFPkzM",
  authDomain: "password-generator-1b26a.firebaseapp.com",
  projectId: "password-generator-1b26a",
  storageBucket: "password-generator-1b26a.appspot.com",
  messagingSenderId: "189261326780",
  appId: "1:189261326780:web:27941d4c58eb87c87ce3b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
// Enable local persistence (persists even when the browser is closed)
setPersistence(auth, browserSessionPersistence);
