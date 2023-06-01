// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBoRANeAjXGxCT_sw_Lv4kpsUXq0Ck0ZvM',
  authDomain: 'react-notes-be11e.firebaseapp.com',
  projectId: 'react-notes-be11e',
  storageBucket: 'react-notes-be11e.appspot.com',
  messagingSenderId: '651218434047',
  appId: '1:651218434047:web:2aa541034bea8fdf2e19ca',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, 'notes');
