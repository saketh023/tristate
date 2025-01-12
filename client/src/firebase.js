// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tristate-417a6.firebaseapp.com",
  projectId: "tristate-417a6",
  storageBucket: "tristate-417a6.firebasestorage.app",
  messagingSenderId: "909432750187",
  appId: "1:909432750187:web:3743fc43bbf9393c18b12e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
