import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  User,
  signUpWithEmail,
  createUserProfile,
  signInWithEmail,
  signOutUser,
  getCurrentUser,
  onAuthStateChange
} from '../firebase/services';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userData = await getCurrentUser(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: userData, error } = await signInWithEmail(email, password);
      
      if (error) {
        throw new Error(error);
      }
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      const { email, password, name, ...profileData } = userData;

      // Step 1: Create user in Firebase Auth
      const { user: firebaseUser, error: authError } = await signUpWithEmail(email, password, name);
      if (authError || !firebaseUser) {
        throw new Error(authError || "Firebase user creation failed.");
      }

      // Step 2: Create user profile in Firestore
      const fullProfile = { 
        email, 
        name, 
        role: 'farmer' as const,
        ...profileData 
      };
      const { user: userProfile, error: profileError } = await createUserProfile(firebaseUser.uid, fullProfile);
      if (profileError || !userProfile) {
        throw new Error(profileError || "User profile creation failed.");
      }
      
      setUser(userProfile);
    } catch (error: any) {
      console.error("Registration Error:", error);
      throw new Error(error.message || 'Registration failed. Please check the console for more details.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};