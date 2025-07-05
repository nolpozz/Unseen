import { getFunctions, httpsCallable } from 'firebase/functions';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const functions = getFunctions();

export const registerWithPreGeneratedPassword = async (email: string, password: string) => {
  try {
    const registerFunction = httpsCallable(functions, 'registerWithPreGeneratedPassword');
    const result = await registerFunction({ email, password });
    return result.data;
  } catch (error: any) {
    if (error.code === 'functions/permission-denied') {
      throw new Error('Invalid or expired credentials. Please contact your administrator.');
    }
    throw new Error('Registration failed. Please try again.');
  }
};

export const signInWithPreGeneratedPassword = async (email: string, password: string) => {
  try {
    // First try to register (in case account doesn't exist yet)
    try {
      await registerWithPreGeneratedPassword(email, password);
    } catch (error: any) {
      // If registration fails, try to sign in (account might already exist)
      if (error.message.includes('Invalid or expired credentials')) {
        // Try regular sign in
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        throw error;
      }
    }
  } catch (error) {
    throw error;
  }
}; 