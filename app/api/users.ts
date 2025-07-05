import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface ArtistProfile {
  bio?: string;
  style?: string;
  region?: string;
  availability?: {
    available: boolean;
    dates?: string[];
  };
  gallery?: {
    id: string;
    url: string;
    title?: string;
    description?: string;
  }[];
  pastEvents?: string[];
  rating?: number;
  totalEvents?: number;
}

export interface EventPlannerProfile {
  company?: string;
  region?: string;
  eventTypes?: string[];
  pastEvents?: string[];
  rating?: number;
  totalEvents?: number;
}

export interface EndUserProfile {
  preferences?: {
    favoriteArtists?: string[];
    favoriteStyles?: string[];
    notifications?: boolean;
  };
  attendedEvents?: string[];
  savedContent?: string[];
}

export interface User {
  id: string;
  email: string;
  role: 'artist' | 'event_planner' | 'end_user';
  displayName?: string;
  profileComplete: boolean;
  profileProgress: number;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  artistProfile?: ArtistProfile;
  eventPlannerProfile?: EventPlannerProfile;
  endUserProfile?: EndUserProfile;
}

export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const createUserProfile = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 