# Firebase Integration Setup Guide

## Overview
Your India Farmers Club application has been successfully integrated with Firebase for authentication and data storage. This guide will help you complete the setup.

## What Has Been Done

### 1. Firebase SDK Installation
- Installed Firebase SDK with authentication and Firestore support
- Created Firebase configuration file (`src/firebase/config.ts`)
- Created Firebase services file (`src/firebase/services.ts`) with authentication and product management functions

### 2. Authentication Integration
- **AuthContext** updated to use Firebase Authentication instead of local backend
- Supports user registration and login with email/password
- User data stored in Firestore database with farmer profile information

### 3. FarmerDashboard Integration
- **Product Management** now uses Firestore database
- Real-time product creation, editing, and deletion
- Products are stored per user and persisted across sessions

### 4. User Data Structure
Users are stored in Firestore with the following fields:
```typescript
{
  uid: string;              // Firebase user ID
  email: string;            // Email address
  name: string;             // Full name
  role: 'farmer';           // Always farmer (unified role)
  phoneNumber: string;      // Phone number
  acresOfLand: string;      // Land size or 'nil' for workers
  age: number;              // Age
  gender: string;           // Gender
  location: string;         // Location
  cropType: string;         // Primary crop type
  yearsOfExperience: number; // Years of farming experience
  preferredLanguage: string; // English/Malayalam/Hindi
  createdAt: Date;          // Registration date
}
```

## Setup Instructions

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `india-farmers-club` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Enable other sign-in providers as needed

### Step 3: Create Firestore Database
1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (for development)
3. Select your preferred location
4. Click "Done"

### Step 4: Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" > Web app icon
4. Register your app with nickname: `farmers-club-web`
5. Copy the `firebaseConfig` object

### Step 5: Update Environment Variables
1. Open `frontend/.env` file
2. Replace the placeholder values with your actual Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_actual_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
REACT_APP_FIREBASE_APP_ID=your_actual_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_actual_measurement_id
```

### Step 6: Update Firestore Security Rules (Production)
When ready for production, update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own products
    match /products/{productId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // All authenticated users can read all products (for marketplace)
    match /products/{productId} {
      allow read: if request.auth != null;
    }
  }
}
```

## Features Available

### Authentication
- ✅ **User Registration** with farmer profile data
- ✅ **Email/Password Login**
- ✅ **Automatic user session management**
- ✅ **Secure logout**

### Dashboard Features
- ✅ **Adaptive content** based on land ownership
- ✅ **Product management** for farmers with land
- ✅ **Job opportunities** for all farmers
- ✅ **Real-time data persistence**

### Data Management
- ✅ **User profiles** stored in Firestore
- ✅ **Product listings** with CRUD operations
- ✅ **Automatic user data loading**
- ✅ **Error handling** for all Firebase operations

## Testing the Integration

### 1. Start the Application
```bash
cd frontend
npm start
```

### 2. Test User Registration
1. Navigate to `/auth`
2. Fill in the farmer registration form
3. Submit - user should be created in Firebase Auth and Firestore

### 3. Test Product Management
1. Login as a farmer with land (acresOfLand != 'nil')
2. Add, edit, and delete products
3. Data should persist after page refresh

### 4. Test Authentication Flow
1. Login/logout functionality
2. Route protection (dashboard requires authentication)
3. User data loading on app start

## Migration from Backend

The application now uses Firebase instead of the local Node.js backend for:
- ✅ User authentication
- ✅ User data storage
- ✅ Product data storage

The backend (`backend/` folder) is no longer required for these features but can be kept for other services if needed.

## Next Steps

1. **Complete Firebase setup** with your project credentials
2. **Test all functionality** with real Firebase project
3. **Deploy to production** with proper security rules
4. **Optional**: Add image upload for products using Firebase Storage
5. **Optional**: Add real-time features using Firestore real-time listeners

## Support

If you encounter any issues:
1. Check Firebase Console for authentication and database logs
2. Verify environment variables are correctly set
3. Ensure Firestore rules allow read/write operations
4. Check browser console for Firebase-related errors

Your application is now fully integrated with Firebase! 🎉