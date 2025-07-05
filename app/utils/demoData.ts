// Demo Data Generator for Testing
// This file creates realistic sample data for testing all app features

import { User, ArtistProfile, EventPlannerProfile, EndUserProfile } from '../../backend/schemas/users';
import { Event, GeneratedContent } from '../api/events';

export const generateDemoUsers = (): User[] => {
  const users: User[] = [
    // Artists
    {
      id: 'artist_1',
      email: 'sarah.artist@example.com',
      role: 'artist',
      displayName: 'Sarah Chen',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop',
      profileComplete: true,
      profileProgress: 100,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-01'),
      lastLoginAt: new Date('2024-03-15'),
      artistProfile: {
        bio: 'Contemporary abstract painter exploring the intersection of technology and human emotion. My work focuses on digital landscapes and the evolving relationship between humans and machines.',
        style: 'Abstract Contemporary',
        region: 'San Francisco, CA',
        availability: {
          available: true,
          dates: ['2024-04-15', '2024-04-20', '2024-05-01']
        },
        gallery: [
          {
            id: 'art_1',
            url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
            title: 'Digital Dreams',
            description: 'Abstract representation of digital consciousness'
          },
          {
            id: 'art_2',
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            title: 'Neural Networks',
            description: 'Exploration of artificial intelligence through color'
          }
        ],
        pastEvents: ['event_1', 'event_3'],
        rating: 4.8,
        totalEvents: 12
      }
    },
    {
      id: 'artist_2',
      email: 'miguel.artist@example.com',
      role: 'artist',
      displayName: 'Miguel Rodriguez',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      profileComplete: true,
      profileProgress: 95,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-10'),
      lastLoginAt: new Date('2024-03-14'),
      artistProfile: {
        bio: 'Street artist and muralist bringing urban culture to life through vibrant colors and bold statements. Specializing in large-scale public art installations.',
        style: 'Street Art',
        region: 'Los Angeles, CA',
        availability: {
          available: true,
          dates: ['2024-04-10', '2024-04-25', '2024-05-05']
        },
        gallery: [
          {
            id: 'art_3',
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            title: 'Urban Pulse',
            description: 'Street art capturing city energy'
          }
        ],
        pastEvents: ['event_2'],
        rating: 4.6,
        totalEvents: 8
      }
    },
    {
      id: 'artist_3',
      email: 'emma.artist@example.com',
      role: 'artist',
      displayName: 'Emma Thompson',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      profileComplete: true,
      profileProgress: 100,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-05'),
      lastLoginAt: new Date('2024-03-12'),
      artistProfile: {
        bio: 'Classical painter with a modern twist, specializing in portraiture and landscape art. My work bridges traditional techniques with contemporary themes.',
        style: 'Classical Contemporary',
        region: 'New York, NY',
        availability: {
          available: false,
          dates: []
        },
        gallery: [
          {
            id: 'art_4',
            url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
            title: 'Modern Muse',
            description: 'Contemporary portrait with classical influences'
          }
        ],
        pastEvents: ['event_1', 'event_2', 'event_3'],
        rating: 4.9,
        totalEvents: 15
      }
    },

    // Event Planners
    {
      id: 'planner_1',
      email: 'james.planner@example.com',
      role: 'event_planner',
      displayName: 'James Wilson',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      profileComplete: true,
      profileProgress: 100,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-08'),
      lastLoginAt: new Date('2024-03-15'),
      eventPlannerProfile: {
        company: 'Wilson Events & Productions',
        region: 'San Francisco, CA',
        eventTypes: ['Corporate', 'Wedding', 'Gallery Opening'],
        pastEvents: ['event_1', 'event_2'],
        rating: 4.7,
        totalEvents: 25
      }
    },
    {
      id: 'planner_2',
      email: 'lisa.planner@example.com',
      role: 'event_planner',
      displayName: 'Lisa Park',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop',
      profileComplete: true,
      profileProgress: 90,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-03-12'),
      lastLoginAt: new Date('2024-03-13'),
      eventPlannerProfile: {
        company: 'Park Creative Events',
        region: 'Los Angeles, CA',
        eventTypes: ['Art Exhibition', 'Launch Party', 'Charity Gala'],
        pastEvents: ['event_3'],
        rating: 4.5,
        totalEvents: 18
      }
    },

    // End Users
    {
      id: 'user_1',
      email: 'alex.user@example.com',
      role: 'end_user',
      displayName: 'Alex Johnson',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      profileComplete: true,
      profileProgress: 85,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-10'),
      lastLoginAt: new Date('2024-03-15'),
      endUserProfile: {
        preferences: {
          favoriteArtists: ['artist_1', 'artist_2'],
          favoriteStyles: ['Abstract', 'Contemporary'],
          notifications: true
        },
        attendedEvents: ['event_1', 'event_2'],
        savedContent: ['content_1', 'content_2']
      }
    },
    {
      id: 'user_2',
      email: 'maria.user@example.com',
      role: 'end_user',
      displayName: 'Maria Garcia',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      profileComplete: false,
      profileProgress: 30,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-15'),
      lastLoginAt: new Date('2024-03-15'),
      endUserProfile: {
        preferences: {
          favoriteArtists: [],
          favoriteStyles: ['Classical'],
          notifications: false
        },
        attendedEvents: ['event_3'],
        savedContent: ['content_3']
      }
    }
  ];

  return users;
};

export const generateDemoEvents = (): Event[] => {
  const events: Event[] = [
    {
      id: 'event_1',
      title: 'Digital Art Revolution',
      description: 'A groundbreaking exhibition showcasing the intersection of technology and traditional art forms. Experience immersive installations, AI-generated artwork, and interactive digital experiences that challenge our perception of creativity.',
      date: new Date('2024-04-15T18:00:00'),
      location: 'San Francisco Museum of Modern Art',
      eventPlannerId: 'planner_1',
      artists: ['artist_1', 'artist_3'],
      status: 'confirmed',
      contractStatus: 'signed',
      verified: true,
      isPublic: true,
      qrCodeId: 'qr_event_1',
      chatId: 'chat_event_1',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-10'),
      generatedContent: [
        {
          id: 'content_1',
          type: 'poem',
          description: 'A mesmerizing digital landscape with flowing colors and geometric patterns',
          content: 'In the digital realm where pixels dance,\nColors flow like liquid light,\nGeometric dreams in perfect trance,\nTechnology and art unite.',
          createdAt: new Date('2024-03-12T14:30:00'),
          anonymous: false,
          userId: 'user_1'
        },
        {
          id: 'content_2',
          type: 'image',
          description: 'Abstract representation of neural networks and consciousness',
          content: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
          createdAt: new Date('2024-03-12T15:45:00'),
          anonymous: true
        }
      ]
    },
    {
      id: 'event_2',
      title: 'Urban Canvas: Street Art Festival',
      description: 'Celebrate the vibrant world of street art with live mural painting, artist talks, and interactive workshops. Experience the energy of urban creativity in this dynamic outdoor festival.',
      date: new Date('2024-04-20T12:00:00'),
      location: 'Downtown Los Angeles Arts District',
      eventPlannerId: 'planner_1',
      artists: ['artist_2', 'artist_3'],
      status: 'confirmed',
      contractStatus: 'signed',
      verified: true,
      isPublic: true,
      qrCodeId: 'qr_event_2',
      chatId: 'chat_event_2',
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-12'),
      generatedContent: [
        {
          id: 'content_3',
          type: 'poem',
          description: 'Bold street art mural with vibrant colors and urban themes',
          content: 'Concrete walls become our stage,\nWhere urban stories come alive,\nEvery brushstroke turns the page,\nOf dreams that help us thrive.',
          createdAt: new Date('2024-03-13T10:15:00'),
          anonymous: false,
          userId: 'user_2'
        }
      ]
    },
    {
      id: 'event_3',
      title: 'Classical Meets Contemporary',
      description: 'An elegant evening showcasing the fusion of classical techniques with modern themes. Experience timeless beauty reimagined for the contemporary world.',
      date: new Date('2024-05-01T19:00:00'),
      location: 'The Metropolitan Gallery, New York',
      eventPlannerId: 'planner_2',
      artists: ['artist_1', 'artist_3'],
      status: 'confirmed',
      contractStatus: 'signed',
      verified: true,
      isPublic: true,
      qrCodeId: 'qr_event_3',
      chatId: 'chat_event_3',
      createdAt: new Date('2024-03-08'),
      updatedAt: new Date('2024-03-15'),
      generatedContent: []
    },
    {
      id: 'event_4',
      title: 'Private Corporate Collection',
      description: 'Exclusive private event for corporate art collection unveiling.',
      date: new Date('2024-04-25T17:00:00'),
      location: 'Private Gallery, San Francisco',
      eventPlannerId: 'planner_1',
      artists: ['artist_1'],
      status: 'draft',
      contractStatus: 'pending',
      verified: false,
      isPublic: false,
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10'),
      generatedContent: []
    }
  ];

  return events;
};

export const generateDemoChats = () => {
  return [
    {
      id: 'chat_event_1',
      participants: ['planner_1', 'artist_1', 'artist_3'],
      eventId: 'event_1',
      lastMessage: {
        id: 'msg_1',
        senderId: 'artist_1',
        content: 'Looking forward to the exhibition!',
        timestamp: new Date('2024-03-14T16:30:00'),
        read: true
      },
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-14T16:30:00')
    },
    {
      id: 'chat_event_2',
      participants: ['planner_1', 'artist_2', 'artist_3'],
      eventId: 'event_2',
      lastMessage: {
        id: 'msg_2',
        senderId: 'planner_1',
        content: 'Weather looks perfect for the outdoor event!',
        timestamp: new Date('2024-03-15T09:15:00'),
        read: false
      },
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-15T09:15:00')
    }
  ];
};

export const generateDemoMessages = () => {
  return [
    {
      id: 'msg_1',
      chatId: 'chat_event_1',
      senderId: 'artist_1',
      content: 'Looking forward to the exhibition!',
      timestamp: new Date('2024-03-14T16:30:00'),
      read: true,
      attachments: []
    },
    {
      id: 'msg_2',
      chatId: 'chat_event_1',
      senderId: 'planner_1',
      content: 'The venue is confirmed and ready for setup.',
      timestamp: new Date('2024-03-14T17:00:00'),
      read: true,
      attachments: []
    },
    {
      id: 'msg_3',
      chatId: 'chat_event_2',
      senderId: 'planner_1',
      content: 'Weather looks perfect for the outdoor event!',
      timestamp: new Date('2024-03-15T09:15:00'),
      read: false,
      attachments: []
    }
  ];
};

// Helper function to get demo data by type
export const getDemoData = (type: 'users' | 'events' | 'chats' | 'messages') => {
  switch (type) {
    case 'users':
      return generateDemoUsers();
    case 'events':
      return generateDemoEvents();
    case 'chats':
      return generateDemoChats();
    case 'messages':
      return generateDemoMessages();
    default:
      return [];
  }
};

// Helper function to get a specific demo user by role
export const getDemoUserByRole = (role: string): User | null => {
  const users = generateDemoUsers();
  return users.find(user => user.role === role) || null;
};

// Helper function to get demo events by status
export const getDemoEventsByStatus = (status: string): Event[] => {
  const events = generateDemoEvents();
  return events.filter(event => event.status === status);
}; 