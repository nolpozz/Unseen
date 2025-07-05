import { doc, setDoc, updateDoc, getDoc, collection, query, where, getDocs, arrayUnion, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  eventPlannerId: string;
  artists: string[]; // Artist IDs
  status: 'draft' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  contractStatus: 'pending' | 'sent' | 'signed' | 'completed';
  verified: boolean;
  chatId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Public event fields
  isPublic: boolean;
  qrCodeId?: string;
  generatedContent?: GeneratedContent[];
}

export interface GeneratedContent {
  id: string;
  type: 'poem' | 'image';
  description: string;
  content: string; // AI-generated poem or image URL
  createdAt: Date;
  anonymous: boolean;
  userId?: string; // Optional, for logged-in users
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: Date;
  location: string;
  artistIds: string[];
}

export const getPublicEvents = async (): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('isPublic', '==', true),
      where('status', 'in', ['confirmed', 'completed']),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    const events: Event[] = [];
    
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching public events:', error);
    throw error;
  }
};

export const getEventWithArtists = async (eventId: string): Promise<{ event: Event; artists: any[] }> => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    if (!eventDoc.exists()) throw new Error('Event not found');
    
    const event = { id: eventDoc.id, ...eventDoc.data() } as Event;
    
    // Fetch artist details
    const artists: any[] = [];
    for (const artistId of event.artists) {
      try {
        const artistDoc = await getDoc(doc(db, 'users', artistId));
        if (artistDoc.exists()) {
          artists.push({ id: artistDoc.id, ...artistDoc.data() });
        }
      } catch (error) {
        console.error(`Error fetching artist ${artistId}:`, error);
      }
    }
    
    return { event, artists };
  } catch (error) {
    console.error('Error fetching event with artists:', error);
    throw error;
  }
};

export const submitArtDescription = async (
  eventId: string,
  description: string,
  userId?: string
): Promise<string> => {
  try {
    const contentId = `content_${Date.now()}`;
    const contentData: GeneratedContent = {
      id: contentId,
      type: 'poem', // Will be determined by AI processing
      description,
      content: '', // Will be filled by AI generation
      createdAt: new Date(),
      anonymous: !userId,
      userId,
    };

    // Add to event's generated content
    await updateDoc(doc(db, 'events', eventId), {
      generatedContent: arrayUnion(contentData),
    });

    // If user is logged in, add to their content history
    if (userId) {
      await updateDoc(doc(db, 'users', userId), {
        'endUserProfile.savedContent': arrayUnion(contentId),
      });
    }

    return contentId;
  } catch (error) {
    console.error('Error submitting art description:', error);
    throw error;
  }
};

export const getUserEventHistory = async (userId: string): Promise<Event[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) throw new Error('User not found');
    
    const userData = userDoc.data();
    const attendedEvents = userData.endUserProfile?.attendedEvents || [];
    
    const events: Event[] = [];
    for (const eventId of attendedEvents) {
      try {
        const eventDoc = await getDoc(doc(db, 'events', eventId));
        if (eventDoc.exists()) {
          events.push({ id: eventDoc.id, ...eventDoc.data() } as Event);
        }
      } catch (error) {
        console.error(`Error fetching event ${eventId}:`, error);
      }
    }
    
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching user event history:', error);
    throw error;
  }
};

export const markEventAsAttended = async (userId: string, eventId: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      'endUserProfile.attendedEvents': arrayUnion(eventId),
    });
  } catch (error) {
    console.error('Error marking event as attended:', error);
    throw error;
  }
};

export const getUpcomingEvents = async (limitCount: number = 10): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('isPublic', '==', true),
      where('status', '==', 'confirmed'),
      where('date', '>=', new Date()),
      orderBy('date', 'asc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const events: Event[] = [];
    
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};

export const createEvent = async (eventData: CreateEventRequest, eventPlannerId: string): Promise<Event> => {
  try {
    const eventId = `event_${Date.now()}`;
    const event: Event = {
      id: eventId,
      ...eventData,
      artists: eventData.artistIds,
      eventPlannerId,
      status: 'draft',
      contractStatus: 'pending',
      verified: false,
      isPublic: false, // Default to private
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'events', eventId), event);
    return event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const bookArtist = async (eventId: string, artistId: string) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      artists: arrayUnion(artistId),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error booking artist:', error);
    throw error;
  }
};

export const getEvent = async (eventId: string): Promise<Event | null> => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    if (eventDoc.exists()) {
      return { id: eventDoc.id, ...eventDoc.data() } as Event;
    }
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const getEventsByPlanner = async (eventPlannerId: string): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('eventPlannerId', '==', eventPlannerId));
    const snapshot = await getDocs(q);
    
    const events: Event[] = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching planner events:', error);
    throw error;
  }
};

export const getEventsByArtist = async (artistId: string): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('artists', 'array-contains', artistId));
    const snapshot = await getDocs(q);
    
    const events: Event[] = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching artist events:', error);
    throw error;
  }
};

export const updateEventStatus = async (eventId: string, status: Event['status']) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating event status:', error);
    throw error;
  }
};

export const updateContractStatus = async (eventId: string, contractStatus: Event['contractStatus']) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      contractStatus,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating contract status:', error);
    throw error;
  }
}; 