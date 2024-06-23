import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeDqCJWuAI0AFDGliybvsQk3Tj2CVI18s",
  authDomain: "app-recursos-cb201.firebaseapp.com",
  projectId: "app-recursos-cb201",
  storageBucket: "app-recursos-cb201.appspot.com",
  messagingSenderId: "309046534327",
  appId: "1:309046534327:web:bfdc8863d75a9858ef6d32",
  measurementId: "G-LHDCVLRCGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db
