import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRGvyQQPBjUmVL5InySmsRfulJ6eT4zmE",
  authDomain: "bughunter-e397c.firebaseapp.com",
  databaseURL: "https://bughunter-e397c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bughunter-e397c",
  storageBucket: "bughunter-e397c.appspot.com",
  messagingSenderId: "619778835660",
  appId: "1:619778835660:web:08339a4fd8fc3b79e86e69",
  measurementId: "G-LGK9LNEFKR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage, ref };
