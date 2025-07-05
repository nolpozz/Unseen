import * as functions from 'firebase-functions';
import { createUserWithRole, generateSecurePassword } from './wrappers/admin';
import { createUserWithPreGeneratedCredential } from './wrappers/auth';

// HTTP function to create users (protected by admin auth)
export const createUser = functions.https.onCall(async (data, context) => {
  // Verify admin access (you should implement proper admin verification)
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { email, role, displayName } = data;
    
    if (!email || !role) {
      throw new functions.https.HttpsError('invalid-argument', 'Email and role are required');
    }

    // Generate secure password
    const password = generateSecurePassword();

    // Create user
    const user = await createUserWithRole({
      email,
      password,
      role,
      displayName,
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
      password, // Return password to admin (should be sent securely)
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create user');
  }
});

// HTTP function for self-registration with pre-generated passwords
export const registerWithPreGeneratedPassword = functions.https.onCall(async (data, context) => {
  try {
    const { email, password } = data;
    
    if (!email || !password) {
      throw new functions.https.HttpsError('invalid-argument', 'Email and password are required');
    }

    // Create user account using pre-generated credential
    const user = await createUserWithPreGeneratedCredential(email, password);

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Error registering with pre-generated password:', error);
    
    if (error.message === 'Invalid or expired credentials') {
      throw new functions.https.HttpsError('permission-denied', 'Invalid or expired credentials');
    }
    
    throw new functions.https.HttpsError('internal', 'Failed to create account');
  }
});

// Scheduled function to clean up inactive users (example)
export const cleanupInactiveUsers = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    // Implementation for cleaning up inactive users
    console.log('Running cleanup of inactive users');
  }); 