// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth,GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyA0D6F9gb6SnwdiMMeTW1dUtMz_5Obe4wY",
  authDomain: "login-82da0.firebaseapp.com",
  projectId: "login-82da0",
  storageBucket: "login-82da0.firebasestorage.app",
  messagingSenderId: "51117656836",
  appId: "1:51117656836:web:285aa03e2f2dc076349e51",
  measurementId: "G-64R1R1H8CB"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { fireDB, auth,app }