import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { auth, db } from './config';

// User interface matching our farmer structure
export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'farmer';
  phoneNumber: string;
  acresOfLand: string;
  age: number;
  gender: string;
  location: string;
  cropType: string;
  yearsOfExperience: number;
  preferredLanguage: string;
  createdAt: Date;
}

// Product interface
export interface Product {
  id?: string;
  userId: string;
  name: string;
  price: number;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication functions
export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Update the user's display name in Firebase Auth
    await updateProfile(user, { displayName });
    return { user, error: null };
  } catch (error: any) {
    console.error("Firebase Auth Error:", error.code, error.message);
    return { user: null, error: error.message };
  }
};

export const createUserProfile = async (userId: string, userData: Omit<User, 'uid' | 'createdAt'>) => {
  try {
    const userDoc: User = {
      uid: userId,
      ...userData,
      createdAt: new Date()
    };
    await setDoc(doc(db, 'users', userId), userDoc);
    return { user: userDoc, error: null };
  } catch (error: any) {
    console.error("Firestore User Creation Error:", error);
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return { user: userDoc.data() as User, error: null };
    } else {
      return { user: null, error: 'User data not found' };
    }
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCurrentUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Products functions
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const productData = {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'products'), productData);
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const getUserProducts = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return { products, error: null };
  } catch (error: any) {
    return { products: [], error: error.message };
  }
};

export const getAllProducts = async () => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return { products, error: null };
  } catch (error: any) {
    return { products: [], error: error.message };
  }
};

export const updateProduct = async (productId: string, updates: Partial<Product>) => {
  try {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    await updateDoc(doc(db, 'products', productId), updateData);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};