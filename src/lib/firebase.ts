import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore, 
  getFirestore, 
  Firestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
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

// Initialize Firestore with Persistent Local Cache (IndexedDB) and specific database ID (spdb)
let firestoreDb: Firestore;
try {
  const cacheSettings = {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  };

  if (FIRESTORE_DATABASE_ID && FIRESTORE_DATABASE_ID !== '(default)') {
    firestoreDb = initializeFirestore(app, cacheSettings, FIRESTORE_DATABASE_ID);
  } else {
    firestoreDb = initializeFirestore(app, cacheSettings);
  }
} catch {
  // If already initialized or persistent cache not supported in environment, fallback to existing instance
  if (FIRESTORE_DATABASE_ID && FIRESTORE_DATABASE_ID !== '(default)') {
    firestoreDb = getFirestore(app, FIRESTORE_DATABASE_ID);
  } else {
    firestoreDb = getFirestore(app);
  }
}

export const db = firestoreDb;
export const PROPERTY_COLLECTION = 'dbproperti';
export const DATABASE_DOC_ID = 'Database';
export const FIREBASE_DB_NAME = 'sentrapropertidb';
