import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { User } from './users';

export interface GalleryItem {
  id: string;
  url: string;
  title?: string;
  description?: string;
  uploadedAt: Date;
}

export interface SearchFilters {
  query?: string;
  region?: string;
  style?: string;
  available?: boolean;
}

export const searchArtists = async (filters: SearchFilters): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    let q = query(usersRef, where('role', '==', 'artist'));

    // Apply filters
    if (filters.region) {
      q = query(q, where('artistProfile.region', '==', filters.region));
    }
    
    if (filters.style) {
      q = query(q, where('artistProfile.style', '==', filters.style));
    }
    
    if (filters.available) {
      q = query(q, where('artistProfile.availability.available', '==', true));
    }

    const snapshot = await getDocs(q);
    const artists: User[] = [];

    snapshot.forEach((doc) => {
      const userData = doc.data() as User;
      const artist = { id: doc.id, ...userData };

      // Apply text search filter if provided
      if (filters.query) {
        const searchTerm = filters.query.toLowerCase();
        const matchesName = artist.displayName?.toLowerCase().includes(searchTerm);
        const matchesStyle = artist.artistProfile?.style?.toLowerCase().includes(searchTerm);
        const matchesBio = artist.artistProfile?.bio?.toLowerCase().includes(searchTerm);
        
        if (matchesName || matchesStyle || matchesBio) {
          artists.push(artist);
        }
      } else {
        artists.push(artist);
      }
    });

    return artists;
  } catch (error) {
    console.error('Error searching artists:', error);
    throw error;
  }
};

export const uploadArtwork = async (
  userId: string,
  imageUri: string,
  title?: string,
  description?: string
): Promise<GalleryItem> => {
  try {
    // Convert image URI to blob (you'll need to implement this based on your image picker)
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Upload to Firebase Storage
    const imageId = `${userId}_${Date.now()}`;
    const storageRef = ref(storage, `artists/${userId}/gallery/${imageId}`);
    await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Create gallery item
    const galleryItem: GalleryItem = {
      id: imageId,
      url: downloadURL,
      title,
      description,
      uploadedAt: new Date(),
    };
    
    // Add to user's gallery
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'artistProfile.gallery': arrayUnion(galleryItem),
      updatedAt: new Date(),
    });
    
    return galleryItem;
  } catch (error) {
    console.error('Error uploading artwork:', error);
    throw error;
  }
};

export const removeArtwork = async (userId: string, artworkId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Get current user data to find the artwork
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) throw new Error('User not found');
    
    const userData = userDoc.data() as User;
    const gallery = userData.artistProfile?.gallery || [];
    const updatedGallery = gallery.filter(item => item.id !== artworkId);
    
    await updateDoc(userRef, {
      'artistProfile.gallery': updatedGallery,
      updatedAt: new Date(),
    });
    
    // Note: You might want to delete the file from Storage as well
    // const storageRef = ref(storage, `artists/${userId}/gallery/${artworkId}`);
    // await deleteObject(storageRef);
    
  } catch (error) {
    console.error('Error removing artwork:', error);
    throw error;
  }
};

export const updateArtistAvailability = async (
  userId: string,
  available: boolean,
  dates?: string[]
) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'artistProfile.availability': {
        available,
        dates: dates || [],
      },
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
};

export const getArtistStats = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) throw new Error('User not found');
    
    const userData = userDoc.data() as User;
    const artistProfile = userData.artistProfile;
    
    return {
      totalEvents: artistProfile?.totalEvents || 0,
      rating: artistProfile?.rating || 0,
      galleryCount: artistProfile?.gallery?.length || 0,
      profileComplete: userData.profileComplete || false,
      profileProgress: userData.profileProgress || 0,
    };
  } catch (error) {
    console.error('Error getting artist stats:', error);
    throw error;
  }
}; 