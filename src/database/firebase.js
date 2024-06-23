import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0bZ7tCAW6464-NZKmsKHW76IoMnWaQR8",
  authDomain: "presentacion-eaf75.firebaseapp.com",
  projectId: "presentacion-eaf75",
  storageBucket: "presentacion-eaf75.appspot.com",
  messagingSenderId: "721977908513",
  appId: "1:721977908513:web:9ca2ec32201400f9647260",
  measurementId: "G-WWLXZ54XP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db
