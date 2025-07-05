import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, onAuthStateChange } from '../api/firebase';
import { getUserData, User } from '../api/users';
import { signInWithPreGeneratedPassword } from '../api/auth';

interface AuthContextProps {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userProfile = await getUserData(firebaseUser.uid);
          setUserData(userProfile);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithPreGeneratedPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { signOutUser } = await import('../api/firebase');
      await signOutUser();
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}; 