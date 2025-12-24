import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from '@/types/firebase';

// Helper function to get collection reference
export function getCollectionRef(collectionName: string): CollectionReference<DocumentData> {
  return collection(db, collectionName);
}

// Helper function to get document reference
export function getDocRef(collectionName: string, docId: string) {
  return doc(db, collectionName, docId);
}

// Generic CRUD operations
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docRef = getDocRef(collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

export async function getAllDocuments<T>(collectionName: string): Promise<T[]> {
  try {
    const colRef = getCollectionRef(collectionName);
    const querySnapshot = await getDocs(colRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
}

export async function setDocument(
  collectionName: string,
  docId: string,
  data: any
): Promise<void> {
  try {
    const docRef = getDocRef(collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<any>
): Promise<void> {
  try {
    const docRef = getDocRef(collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  try {
    const docRef = getDocRef(collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

// Query helper
export async function queryDocuments<T>(
  collectionName: string,
  field: string,
  operator: any,
  value: any
): Promise<T[]> {
  try {
    const colRef = getCollectionRef(collectionName);
    const q = query(colRef, where(field, operator, value));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
}

