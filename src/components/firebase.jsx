// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import { getStorage } from 'firebase/storage';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJXDCIXw5LZZAn-GqrI9jKPCzKflbIl-o",
  authDomain: "client-authentication-62110.firebaseapp.com",
  projectId: "client-authentication-62110",
  storageBucket: "client-authentication-62110.appspot.com",
  messagingSenderId: "538215198463",
  appId: "1:538215198463:web:d6ef100ff643dfa054a6ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);