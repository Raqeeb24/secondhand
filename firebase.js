// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd3XBMMV35-dd5ijUdmRrfVyWtdcW1G5o",
  authDomain: "secondhand-9fdb6.firebaseapp.com",
  projectId: "secondhand-9fdb6",
  storageBucket: "secondhand-9fdb6.appspot.com",
  messagingSenderId: "419578642633",
  appId: "1:419578642633:web:4caf64219213bd66748d18"
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
}else {
    app = firebase.app();
}

export {firebase};