import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
// import { getAnalytics } from 'firebase/analytics'
import firebaseJSON from '../firebase.json'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
}

export function getFirebaseApp() {
  const firebaseApp = initializeApp(firebaseConfig)
  const auth = getAuth(firebaseApp)
  const db = getFirestore(firebaseApp)
  if (process.env.NODE_ENV === 'development') {
    connectAuthEmulator(auth, 'http://localhost:' + firebaseJSON.emulators.auth.port)
    connectFirestoreEmulator(db, 'localhost', firebaseJSON.emulators.firestore.port);
  }
  // const firebaseAnalytics = getAnalytics(firebaseApp)
  return { firebaseApp, auth }
}