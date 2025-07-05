import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK (should be done once in your main functions file)
if (!admin.apps.length) {
  admin.initializeApp();
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: 'artist' | 'event_planner' | 'end_user';
  displayName?: string;
}

export const createUserWithRole = async (userData: CreateUserRequest) => {
  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
    });

    // Create user profile in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: userData.email,
      role: userData.role,
      displayName: userData.displayName,
      profileComplete: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      role: userData.role,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const generateSecurePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const deleteUser = async (uid: string) => {
  try {
    // Delete from Firestore first
    await admin.firestore().collection('users').doc(uid).delete();
    
    // Then delete from Firebase Auth
    await admin.auth().deleteUser(uid);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUserRole = async (uid: string, newRole: string) => {
  try {
    await admin.firestore().collection('users').doc(uid).update({
      role: newRole,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}; 