import * as admin from 'firebase-admin';
import { createUserWithRole } from './admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

export interface PreGeneratedCredential {
  email: string;
  password: string;
  role: 'artist' | 'event_planner';
  displayName?: string;
  expiresAt?: Date;
  used: boolean;
}

export const validatePreGeneratedPassword = async (
  email: string, 
  password: string
): Promise<PreGeneratedCredential | null> => {
  try {
    // Query the pre-generated credentials collection
    const credentialsRef = admin.firestore().collection('preGeneratedCredentials');
    const query = credentialsRef
      .where('email', '==', email)
      .where('password', '==', password)
      .where('used', '==', false)
      .limit(1);

    const snapshot = await query.get();
    
    if (snapshot.empty) {
      return null;
    }

    const credential = snapshot.docs[0].data() as PreGeneratedCredential;
    
    // Check if credential has expired
    if (credential.expiresAt && new Date() > credential.expiresAt.toDate()) {
      return null;
    }

    return credential;
  } catch (error) {
    console.error('Error validating pre-generated password:', error);
    throw error;
  }
};

export const markCredentialAsUsed = async (email: string, password: string) => {
  try {
    const credentialsRef = admin.firestore().collection('preGeneratedCredentials');
    const query = credentialsRef
      .where('email', '==', email)
      .where('password', '==', password)
      .limit(1);

    const snapshot = await query.get();
    
    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await docRef.update({ used: true, usedAt: admin.firestore.FieldValue.serverTimestamp() });
    }
  } catch (error) {
    console.error('Error marking credential as used:', error);
    throw error;
  }
};

export const createUserWithPreGeneratedCredential = async (
  email: string,
  password: string
) => {
  try {
    // Validate the pre-generated credential
    const credential = await validatePreGeneratedPassword(email, password);
    
    if (!credential) {
      throw new Error('Invalid or expired credentials');
    }

    // Create the user account
    const user = await createUserWithRole({
      email: credential.email,
      password: credential.password, // Use the pre-generated password
      role: credential.role,
      displayName: credential.displayName,
    });

    // Mark the credential as used
    await markCredentialAsUsed(email, password);

    return user;
  } catch (error) {
    console.error('Error creating user with pre-generated credential:', error);
    throw error;
  }
}; 