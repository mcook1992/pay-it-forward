import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA7QP9zjkKp0kUaDgUfoMhXRzcFpys880Y",
  authDomain: "pay-it-forward-b148c.firebaseapp.com",
  databaseURL: "https://pay-it-forward-b148c.firebaseio.com",
  projectId: "pay-it-forward-b148c",
  storageBucket: "pay-it-forward-b148c.appspot.com",
  messagingSenderId: "614632694078",
  appId: "1:614632694078:web:2bc9a69acb3ae7e69dcc6f",
  measurementId: "G-G7JKS77ZPZ"
};
firebase.initializeApp(firebaseConfig);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
