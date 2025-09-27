// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhN-DQQqWLo7s2SHMEHbp67P7mPqips3k",
  authDomain: "lista--cumparaturi.firebaseapp.com",
  databaseURL: "https://lista--cumparaturi-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lista--cumparaturi",
  storageBucket: "lista--cumparaturi.firebasestorage.app",
  messagingSenderId: "1017722987139",
  appId: "1:1017722987139:web:9a00866e9b5ace247131b6",
  measurementId: "G-045KJZYQ9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Funcții pentru salvare și citire listă
export function saveList(magazin, list) {
  set(ref(db, 'lists/' + magazin), list);
}

export function subscribeList(magazin, callback) {
  const listRef = ref(db, 'lists/' + magazin);
  onValue(listRef, (snapshot) => {
    callback(snapshot.val() || []);
  });
}
