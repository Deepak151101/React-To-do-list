// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDVx7op5EiwdjWOBTAj677P7BhwR92-2gA",
  authDomain: "todo-app-f2159.firebaseapp.com",
  projectId: "todo-app-f2159",
  storageBucket: "todo-app-f2159.appspot.com",
  messagingSenderId: "455971177876",
  appId: "1:455971177876:web:cf1d6047a07c8fc2777b81",
  measurementId: "G-7NPRV8ZB9Q",
});

const db = firebaseApp.firestore();

export default db;