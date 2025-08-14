// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfY0rbRBWi3L6bm1DJ99htoOOPrhD0jgw",
  authDomain: "bullsstoreeasy-45b70.firebaseapp.com",
  databaseURL: "https://bullsstoreeasy-45b70-default-rtdb.firebaseio.com",
  projectId: "bullsstoreeasy-45b70",
  storageBucket: "bullsstoreeasy-45b70.appspot.com",
  messagingSenderId: "902555612373",
  appId: "1:902555612373:web:4d51f72aef9eb417545e5c",
  measurementId: "G-7X0QLN0W5C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const database = getDatabase(app);
export const storage = getStorage(app);
