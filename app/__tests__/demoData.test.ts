// Unit Tests for Demo Data
import { 
  generateDemoUsers, 
  generateDemoEvents, 
  generateDemoChats, 
  generateDemoMessages,
  getDemoData 
} from '../utils/demoData';
import { validateUser, validateEvent } from '../utils/testUtils';

describe('Demo Data Generation', () => {
  describe('generateDemoUsers', () => {
    it('should generate valid users with all required fields', () => {
      const users = generateDemoUsers();
      
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      
      users.forEach(user => {
        expect(user.id).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.role).toBeDefined();
        expect(user.createdAt).toBeDefined();
        expect(user.profileProgress).toBeGreaterThanOrEqual(0);
        expect(user.profileProgress).toBeLessThanOrEqual(100);
      });
    });

    it('should include users of all roles', () => {
      const users = generateDemoUsers();
      const roles = users.map(user => user.role);
      
      expect(roles).toContain('artist');
      expect(roles).toContain('event_planner');
      expect(roles).toContain('end_user');
    });

    it('should have valid email formats', () => {
      const users = generateDemoUsers();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      users.forEach(user => {
        expect(emailRegex.test(user.email)).toBe(true);
      });
    });
  });

  describe('generateDemoEvents', () => {
    it('should generate valid events with all required fields', () => {
      const events = generateDemoEvents();
      
      expect(events).toBeDefined();
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
      
      events.forEach(event => {
        expect(event.id).toBeDefined();
        expect(event.title).toBeDefined();
        expect(event.description).toBeDefined();
        expect(event.date).toBeDefined();
        expect(event.location).toBeDefined();
        expect(event.eventPlannerId).toBeDefined();
        expect(event.artists).toBeDefined();
        expect(Array.isArray(event.artists)).toBe(true);
      });
    });

    it('should have future event dates', () => {
      const events = generateDemoEvents();
      const now = new Date();
      
      events.forEach(event => {
        expect(new Date(event.date)).toBeGreaterThan(now);
      });
    });

    it('should have at least one artist per event', () => {
      const events = generateDemoEvents();
      
      events.forEach(event => {
        expect(event.artists.length).toBeGreaterThan(0);
      });
    });

    it('should include both public and private events', () => {
      const events = generateDemoEvents();
      const publicEvents = events.filter(event => event.isPublic);
      const privateEvents = events.filter(event => !event.isPublic);
      
      expect(publicEvents.length).toBeGreaterThan(0);
      expect(privateEvents.length).toBeGreaterThan(0);
    });
  });

  describe('generateDemoChats', () => {
    it('should generate valid chats', () => {
      const chats = generateDemoChats();
      
      expect(chats).toBeDefined();
      expect(Array.isArray(chats)).toBe(true);
      expect(chats.length).toBeGreaterThan(0);
      
      chats.forEach(chat => {
        expect(chat.id).toBeDefined();
        expect(chat.participants).toBeDefined();
        expect(Array.isArray(chat.participants)).toBe(true);
        expect(chat.eventId).toBeDefined();
        expect(chat.lastMessage).toBeDefined();
        expect(chat.createdAt).toBeDefined();
        expect(chat.updatedAt).toBeDefined();
      });
    });
  });

  describe('generateDemoMessages', () => {
    it('should generate valid messages', () => {
      const messages = generateDemoMessages();
      
      expect(messages).toBeDefined();
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThan(0);
      
      messages.forEach(message => {
        expect(message.id).toBeDefined();
        expect(message.chatId).toBeDefined();
        expect(message.senderId).toBeDefined();
        expect(message.content).toBeDefined();
        expect(message.timestamp).toBeDefined();
        expect(typeof message.read).toBe('boolean');
        expect(message.attachments).toBeDefined();
        expect(Array.isArray(message.attachments)).toBe(true);
      });
    });
  });

  describe('getDemoData', () => {
    it('should return correct data types', () => {
      const users = getDemoData('users');
      const events = getDemoData('events');
      const chats = getDemoData('chats');
      const messages = getDemoData('messages');
      
      expect(Array.isArray(users)).toBe(true);
      expect(Array.isArray(events)).toBe(true);
      expect(Array.isArray(chats)).toBe(true);
      expect(Array.isArray(messages)).toBe(true);
    });

    it('should return empty array for invalid type', () => {
      const invalidData = getDemoData('invalid' as any);
      expect(Array.isArray(invalidData)).toBe(true);
      expect(invalidData.length).toBe(0);
    });
  });
});

describe('Demo Data Validation', () => {
  describe('User Validation', () => {
    it('should validate all demo users', () => {
      const users = generateDemoUsers();
      
      users.forEach(user => {
        const validation = validateUser(user);
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      });
    });
  });

  describe('Event Validation', () => {
    it('should validate all demo events', () => {
      const events = generateDemoEvents();
      
      events.forEach(event => {
        const validation = validateEvent(event);
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      });
    });
  });
});

describe('Demo Data Consistency', () => {
  it('should have consistent data relationships', () => {
    const users = generateDemoUsers();
    const events = generateDemoEvents();
    
    // Check that event planners exist
    const eventPlannerIds = new Set(users.filter(u => u.role === 'event_planner').map(u => u.id));
    events.forEach(event => {
      expect(eventPlannerIds.has(event.eventPlannerId)).toBe(true);
    });
    
    // Check that artists exist
    const artistIds = new Set(users.filter(u => u.role === 'artist').map(u => u.id));
    events.forEach(event => {
      event.artists.forEach(artistId => {
        expect(artistIds.has(artistId)).toBe(true);
      });
    });
  });

  it('should have valid user profile references', () => {
    const users = generateDemoUsers();
    const events = generateDemoEvents();
    const eventIds = new Set(events.map(e => e.id));
    
    users.forEach(user => {
      // Check artist profile references
      if (user.artistProfile?.pastEvents) {
        user.artistProfile.pastEvents.forEach(eventId => {
          expect(eventIds.has(eventId)).toBe(true);
        });
      }
      
      // Check event planner profile references
      if (user.eventPlannerProfile?.pastEvents) {
        user.eventPlannerProfile.pastEvents.forEach(eventId => {
          expect(eventIds.has(eventId)).toBe(true);
        });
      }
      
      // Check end user profile references
      if (user.endUserProfile?.attendedEvents) {
        user.endUserProfile.attendedEvents.forEach(eventId => {
          expect(eventIds.has(eventId)).toBe(true);
        });
      }
    });
  });
}); 