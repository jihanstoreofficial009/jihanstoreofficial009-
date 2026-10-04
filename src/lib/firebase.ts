import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection, 
  getDocs, 
  getDoc,
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  increment,
  initializeFirestore,
  setLogLevel
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import firebaseConfig from '@/firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Set silent log level so initial reconnection warnings don't log to console.error
setLogLevel('error');

// Initialize with long-polling auto-detection for reliable connections in iframe environments
try {
  initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  // Already initialized or fallback
}

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

/**
 * Uploads an image/file to Firebase Storage and returns the public download URL.
 * Includes graceful fallback to optimized Data URL if Storage fails or is unavailable.
 */
export async function uploadImageFile(file: File, folder = 'uploads'): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `${folder}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, path);

  try {
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type
    });
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (storageError) {
    console.warn('Firebase Storage upload failed, attempting fallback:', storageError);
    // If Firebase Storage is blocked by rules or bucket configuration, read as Data URL so admin is not stopped
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file buffer'));
        }
      };
      reader.onerror = () => reject(reader.error || new Error('File read error'));
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Deletes an image from Firebase Storage if it's a storage URL.
 */
export async function deleteStorageFile(url: string): Promise<void> {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return;
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('Firebase storage file deletion skipped:', err);
  }
}

export const ADMIN_EMAIL = 'jihanstoreofficial009@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test as required by skill
export async function testConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      return;
    } catch (error) {
      if (i === retries - 1) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Please check your Firebase configuration.");
        }
      } else {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
  }
}

testConnection();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  type User,
  doc,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment
};
