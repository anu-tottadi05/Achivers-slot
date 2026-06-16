import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  collection, 
  query, 
  where,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Registration, Stall, LiveAnnouncement } from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Test Firestore Connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection verified and authenticated successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("Please check your Firebase configuration or internet status. Client detected offline.");
    }
  }
}
testConnection();

// Error handler specified by Firebase Integration Skill
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
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
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

// Global functions for registrations
export async function saveRegistration(reg: Registration): Promise<void> {
  const path = `registrations/AS-REG-${reg.eventId}-${reg.userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  try {
    await setDoc(doc(db, 'registrations', `AS-REG-${reg.eventId}-${reg.userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`), reg);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function cancelRegistration(eventId: string, userEmail: string): Promise<void> {
  const idStr = `AS-REG-${eventId}-${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const path = `registrations/${idStr}`;
  try {
    await deleteDoc(doc(db, 'registrations', idStr));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchAllRegistrations(): Promise<Registration[]> {
  const path = 'registrations';
  try {
    const qSnapshot = await getDocs(collection(db, 'registrations'));
    const regs: Registration[] = [];
    qSnapshot.forEach((docSnap) => {
      regs.push(docSnap.data() as Registration);
    });
    return regs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Global functions for stalls
export async function saveStallToDb(stall: Stall): Promise<void> {
  const path = `stalls/${stall.id}`;
  try {
    await setDoc(doc(db, 'stalls', stall.id), stall);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchAllStalls(): Promise<Stall[]> {
  const path = 'stalls';
  try {
    const qSnapshot = await getDocs(collection(db, 'stalls'));
    const stallsList: Stall[] = [];
    qSnapshot.forEach((docSnap) => {
      stallsList.push(docSnap.data() as Stall);
    });
    return stallsList;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Global functions for announcements
export async function saveAnnouncementToDb(ann: LiveAnnouncement): Promise<void> {
  const path = `announcements/${ann.id}`;
  try {
    await setDoc(doc(db, 'announcements', ann.id), ann);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchAllAnnouncements(): Promise<LiveAnnouncement[]> {
  const path = 'announcements';
  try {
    const qSnapshot = await getDocs(collection(db, 'announcements'));
    const annsList: LiveAnnouncement[] = [];
    qSnapshot.forEach((docSnap) => {
      annsList.push(docSnap.data() as LiveAnnouncement);
    });
    return annsList;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
