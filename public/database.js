import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-database.js";

// 🔹 Înlocuiește cu datele tale din Firebase Console
const firebaseConfig = {
  apiKey: "API_KEY_TAU",
  authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function saveList(magazin, list) {
  set(ref(db, 'lists/' + magazin), list);
}

export function subscribeList(magazin, callback) {
  const listRef = ref(db, 'lists/' + magazin);
  onValue(listRef, (snapshot) => {
    callback(snapshot.val() || []);
  });
}
