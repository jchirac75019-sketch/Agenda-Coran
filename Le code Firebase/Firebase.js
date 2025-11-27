// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApUV95mV7_YC29KKxdLcjlddf564PJeeg",
  authDomain: "quran-s-agenda.firebaseapp.com",
  projectId: "quran-s-agenda",
  storageBucket: "quran-s-agenda.firebasestorage.app",
  messagingSenderId: "771795458928",
  appId: "1:771795458928:web:3dbf37f776d7ca2e544db5",
  measurementId: "G-33HN1TPBFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);