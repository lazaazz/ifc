// Firebase Admin SDK User Service (if you want to keep backend)
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id-default-rtdb.firebaseio.com'
});

const db = admin.firestore();
const auth = admin.auth();

class FirebaseUserService {
  // Create user with custom claims
  static async createUser(userData) {
    try {
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.name,
        emailVerified: false
      });

      // Store additional user data in Firestore
      const userDoc = {
        uid: userRecord.uid,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        role: 'farmer',
        acresOfLand: userData.acresOfLand,
        age: userData.age,
        gender: userData.gender,
        location: userData.location,
        cropType: userData.cropType,
        yearsOfExperience: userData.yearsOfExperience,
        preferredLanguage: userData.preferredLanguage,
        isVerified: false,
        profileImage: 'default-profile.jpg',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('users').doc(userRecord.uid).set(userDoc);

      return { success: true, user: userDoc };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get user by UID
  static async getUserById(uid) {
    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) {
        return { success: true, user: userDoc.data() };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update user
  static async updateUser(uid, updateData) {
    try {
      await db.collection('users').doc(uid).update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete user
  static async deleteUser(uid) {
    try {
      // Delete from Firebase Auth
      await auth.deleteUser(uid);
      // Delete from Firestore
      await db.collection('users').doc(uid).delete();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Verify user
  static async verifyUser(uid) {
    try {
      await auth.updateUser(uid, { emailVerified: true });
      await db.collection('users').doc(uid).update({
        isVerified: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all farmers with land
  static async getFarmersWithLand() {
    try {
      const snapshot = await db.collection('users')
        .where('acresOfLand', '!=', 'nil')
        .get();
      
      const farmers = [];
      snapshot.forEach(doc => {
        farmers.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, farmers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get agricultural workers
  static async getAgriculturalWorkers() {
    try {
      const snapshot = await db.collection('users')
        .where('acresOfLand', '==', 'nil')
        .get();
      
      const workers = [];
      snapshot.forEach(doc => {
        workers.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, workers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = FirebaseUserService;