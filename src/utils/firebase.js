
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyALJOuxdWQmht1ZkfkQN-7_HTl4j5eeSEQ",
  authDomain: "shopverse-5595c.firebaseapp.com",
  projectId: "shopverse-5595c",
  storageBucket: "shopverse-5595c.appspot.com",
  messagingSenderId: "723939521605",
  appId: "1:723939521605:web:6a9572f0814246da8c9f2c",
  measurementId: "G-C471YBK81P",
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);


let messaging = null;
try {
  messaging = getMessaging(app);
} catch (err) {
  console.warn("Firebase Messaging not supported in this environment.");
}
export { messaging };

export default app;
