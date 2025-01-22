//Environment Variables
import { env } from "@/lib/env";
import { firebaseConfig } from "@/firebase.config";

//Import Firebase App Starter
import { initializeApp } from "firebase/app";
//Imports for Firestore
import {
  CACHE_SIZE_UNLIMITED,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
//Import for Authentication
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";

/*
 * Firebase App Initialization
 */
const app = initializeApp(firebaseConfig);

/**
 * Enable Persistence
 */
initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    tabManager: persistentMultipleTabManager(),
  }),
});

/**
 * Firebase DB Initialization
 */
const Database = getFirestore(app);

/**
 * Firebase Auth Initialization
 */
const Auth = getAuth(app);
/**
 * Firebase Storage Initialization
 */
const Storage = getStorage(app);
/**
 * Firbase Functions
 */
const Functions = getFunctions(app, env.firebase.functionRegion);
/**
 * Firebase RTDB Initialization
 */
const RTDatabase = getDatabase(app);

export { app, Database, Auth, Storage, RTDatabase, Functions };
