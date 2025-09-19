// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZZMTIHOSSvnr7O4-QvPmqzP1WItDs60E",
  authDomain: "bot-df6ab.firebaseapp.com",
  projectId: "bot-df6ab",
  storageBucket: "bot-df6ab.firebasestorage.app",
  messagingSenderId: "840167459879",
  appId: "1:840167459879:web:dfbbeb97873b5988ec1202",
  measurementId: "G-VMCWFSKXVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Make Firebase services available globally (for debugging and React components)
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;

console.log('Firebase initialized successfully!');

// Note: Input handling and form submission should be done in React components,
// not in this global initialization file.
