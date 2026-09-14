import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  measurementId: firebaseConfigJson.measurementId
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const FIRESTORE_DATABASE_ID = firebaseConfigJson.firestoreDatabaseId || 'spdb';

// Initialize Firestore with specific database ID (spdb)
let firestoreDb: Firestore;
try {
  if (FIRESTORE_DATABASE_ID && FIRESTORE_DATABASE_ID !== '(default)') {
    firestoreDb = getFirestore(app, FIRESTORE_DATABASE_ID);
  } else {
    firestoreDb = getFirestore(app);
  }
} catch {
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb;
export const PROPERTY_COLLECTION = 'dbproperti';
export const DATABASE_DOC_ID = 'Database';
export const FIREBASE_DB_NAME = 'sentrapropertidb';
