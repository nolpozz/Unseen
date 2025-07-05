// Testing Utilities for App Validation
// This file provides tools for testing app functionality and data integrity

import { UserSchema as User } from '../../backend/schemas/users';
import { Event, GeneratedContent } from '../api/events';

// Test Configuration
export const TEST_CONFIG = {
  timeout: 10000,
  retryAttempts: 3,
  mockDelay: 1000,
};

// Validation Functions
export const validateUser = (user: User): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields
  if (!user.id) errors.push('User ID is required');
  if (!user.email) errors.push('Email is required');
  if (!user.role) errors.push('Role is required');
  if (!user.createdAt) errors.push('Created date is required');

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (user.email && !emailRegex.test(user.email)) {
    errors.push('Invalid email format');
  }

  // Role validation
  const validRoles = ['artist', 'event_planner', 'end_user', 'admin'];
  if (user.role && !validRoles.includes(user.role)) {
    errors.push('Invalid user role');
  }

  // Profile completion validation
  if (user.profileProgress < 0 || user.profileProgress > 100) {
    errors.push('Profile progress must be between 0 and 100');
  }

  // Role-specific validation
  if (user.role === 'artist' && user.artistProfile) {
    if (!user.artistProfile.style) {
      errors.push('Artist style is required');
    }
    if (!user.artistProfile.region) {
      errors.push('Artist region is required');
    }
  }

  if (user.role === 'event_planner' && user.eventPlannerProfile) {
    if (!user.eventPlannerProfile.company) {
      errors.push('Event planner company is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEvent = (event: Event): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields
  if (!event.id) errors.push('Event ID is required');
  if (!event.title) errors.push('Event title is required');
  if (!event.description) errors.push('Event description is required');
  if (!event.date) errors.push('Event date is required');
  if (!event.location) errors.push('Event location is required');
  if (!event.eventPlannerId) errors.push('Event planner ID is required');
  if (!event.artists) errors.push('Artists array is required');

  // Date validation
  if (event.date && new Date(event.date) < new Date()) {
    errors.push('Event date cannot be in the past');
  }

  // Status validation
  const validStatuses = ['draft', 'pending', 'confirmed', 'completed', 'cancelled'];
  if (event.status && !validStatuses.includes(event.status)) {
    errors.push('Invalid event status');
  }

  // Contract status validation
  const validContractStatuses = ['pending', 'sent', 'signed', 'completed'];
  if (event.contractStatus && !validContractStatuses.includes(event.contractStatus)) {
    errors.push('Invalid contract status');
  }

  // Artists array validation
  if (event.artists && event.artists.length === 0) {
    errors.push('Event must have at least one artist');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateGeneratedContent = (content: GeneratedContent): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields
  if (!content.id) errors.push('Content ID is required');
  if (!content.type) errors.push('Content type is required');
  if (!content.description) errors.push('Content description is required');
  if (!content.content) errors.push('Content is required');
  if (!content.createdAt) errors.push('Created date is required');

  // Type validation
  const validTypes = ['poem', 'image'];
  if (content.type && !validTypes.includes(content.type)) {
    errors.push('Invalid content type');
  }

  // Description length
  if (content.description && content.description.length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  // Content validation based on type
  if (content.type === 'image' && !content.content.startsWith('http')) {
    errors.push('Image content must be a valid URL');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Mock API Functions for Testing
export const mockApiCall = async <T>(
  data: T,
  shouldFail: boolean = false,
  delay: number = TEST_CONFIG.mockDelay
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Mock API call failed'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

export const mockApiCallWithRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = TEST_CONFIG.retryAttempts
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) {
        throw lastError;
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw lastError!;
};

// Performance Testing
export const measurePerformance = async <T>(
  fn: () => Promise<T>,
  name: string = 'Function'
): Promise<{ result: T; duration: number }> => {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`${name} took ${duration.toFixed(2)}ms`);
  return { result, duration };
};

// Data Consistency Testing
export const checkDataConsistency = (users: User[], events: Event[]): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];

  // Check if event planners exist for events
  const eventPlannerIds = new Set(users.filter(u => u.role === 'event_planner').map(u => u.id));
  events.forEach(event => {
    if (!eventPlannerIds.has(event.eventPlannerId)) {
      issues.push(`Event ${event.id} references non-existent event planner ${event.eventPlannerId}`);
    }
  });

  // Check if artists exist for events
  const artistIds = new Set(users.filter(u => u.role === 'artist').map(u => u.id));
  events.forEach(event => {
    event.artists.forEach(artistId => {
      if (!artistIds.has(artistId)) {
        issues.push(`Event ${event.id} references non-existent artist ${artistId}`);
      }
    });
  });

  // Check if events exist for user profiles
  const eventIds = new Set(events.map(e => e.id));
  users.forEach(user => {
    if (user.artistProfile?.pastEvents) {
      user.artistProfile.pastEvents.forEach(eventId => {
        if (!eventIds.has(eventId)) {
          issues.push(`Artist ${user.id} references non-existent event ${eventId}`);
        }
      });
    }
    if (user.eventPlannerProfile?.pastEvents) {
      user.eventPlannerProfile.pastEvents.forEach(eventId => {
        if (!eventIds.has(eventId)) {
          issues.push(`Event planner ${user.id} references non-existent event ${eventId}`);
        }
      });
    }
    if (user.endUserProfile?.attendedEvents) {
      user.endUserProfile.attendedEvents.forEach(eventId => {
        if (!eventIds.has(eventId)) {
          issues.push(`End user ${user.id} references non-existent event ${eventId}`);
        }
      });
    }
  });

  return {
    isValid: issues.length === 0,
    issues
  };
};

// UI Testing Helpers
export const simulateUserInteraction = async (
  action: () => Promise<void>,
  expectedDuration: number = 1000
): Promise<{ success: boolean; duration: number; error?: string }> => {
  const startTime = performance.now();
  
  try {
    await action();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      success: true,
      duration,
      error: duration > expectedDuration ? 'Interaction took longer than expected' : undefined
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      success: false,
      duration,
      error: (error as Error).message
    };
  }
};

// Network Testing
export const testNetworkConnectivity = async (): Promise<{ isConnected: boolean; latency: number }> => {
  const startTime = performance.now();
  
  try {
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    return {
      isConnected: response.ok,
      latency
    };
  } catch (error) {
    return {
      isConnected: false,
      latency: 0
    };
  }
};

// Storage Testing
export const testLocalStorage = (): { isAvailable: boolean; error?: string } => {
  try {
    const testKey = '__test__';
    const testValue = 'test';
    
    localStorage.setItem(testKey, testValue);
    const retrievedValue = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    return {
      isAvailable: retrievedValue === testValue
    };
  } catch (error) {
    return {
      isAvailable: false,
      error: (error as Error).message
    };
  }
};

// Test Report Generator
export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

export const generateTestReport = (results: TestResult[]): string => {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  let report = `
=== TEST REPORT ===
Total Tests: ${totalTests}
Passed: ${passedTests}
Failed: ${failedTests}
Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%
Total Duration: ${totalDuration.toFixed(2)}ms

`;

  if (failedTests > 0) {
    report += 'FAILED TESTS:\n';
    results.filter(r => !r.passed).forEach(result => {
      report += `- ${result.name}: ${result.error}\n`;
    });
    report += '\n';
  }

  report += 'ALL RESULTS:\n';
  results.forEach(result => {
    const status = result.passed ? '✓' : '✗';
    report += `${status} ${result.name} (${result.duration.toFixed(2)}ms)\n`;
  });

  return report;
}; 