// Firestore Schema for Users Collection

export interface UserSchema {
  // Basic Info
  id: string; // Document ID (Firebase Auth UID)
  email: string;
  role: 'artist' | 'event_planner' | 'end_user';
  displayName?: string;
  
  // Profile Status
  profileComplete: boolean;
  profileProgress: number; // 0-100 percentage
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // Role-specific fields
  artistProfile?: ArtistProfile;
  eventPlannerProfile?: EventPlannerProfile;
  endUserProfile?: EndUserProfile;
}

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
  pastEvents?: string[]; // Event IDs
  rating?: number;
  totalEvents?: number;
}

export interface EventPlannerProfile {
  company?: string;
  region?: string;
  eventTypes?: string[];
  pastEvents?: string[]; // Event IDs
  rating?: number;
  totalEvents?: number;
}

export interface EndUserProfile {
  preferences?: {
    favoriteArtists?: string[];
    favoriteStyles?: string[];
    notifications?: boolean;
  };
  attendedEvents?: string[]; // Event IDs
  savedContent?: string[]; // Generated content IDs
}

// Firestore Security Rules Example:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Admins can read all user profiles
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Artists can read other artist profiles for discovery
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'artist' &&
        get(/databases/$(database)/documents/users/$(userId)).data.role == 'artist';
    }
  }
}
*/ 