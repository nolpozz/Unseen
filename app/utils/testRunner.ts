// Test Runner for App Validation
// This file runs comprehensive tests to validate app functionality

import { 
  generateDemoUsers, 
  generateDemoEvents, 
  generateDemoChats, 
  generateDemoMessages,
  getDemoData 
} from './demoData';
import {
  validateUser,
  validateEvent,
  validateGeneratedContent,
  checkDataConsistency,
  measurePerformance,
  testNetworkConnectivity,
  testLocalStorage,
  generateTestReport,
  TestResult,
  mockApiCall
} from './testUtils';
import { generateContent, analyzeArtDescription } from '../api/ai';

class AppTestRunner {
  private results: TestResult[] = [];

  async runAllTests(): Promise<string> {
    console.log('🚀 Starting App Test Suite...\n');
    
    // Run all test categories
    await this.runDataValidationTests();
    await this.runAPITests();
    await this.runPerformanceTests();
    await this.runIntegrationTests();
    await this.runSystemTests();
    
    // Generate and return test report
    const report = generateTestReport(this.results);
    console.log(report);
    
    return report;
  }

  private async runDataValidationTests(): Promise<void> {
    console.log('📊 Running Data Validation Tests...');
    
    const users = generateDemoUsers();
    const events = generateDemoEvents();
    
    // Test user validation
    for (const user of users) {
      const result = await this.runTest(
        `Validate User: ${user.displayName || user.email}`,
        () => {
          const validation = validateUser(user);
          if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
          }
          return validation;
        }
      );
    }
    
    // Test event validation
    for (const event of events) {
      const result = await this.runTest(
        `Validate Event: ${event.title}`,
        () => {
          const validation = validateEvent(event);
          if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
          }
          return validation;
        }
      );
    }
    
    // Test data consistency
    const consistencyResult = await this.runTest(
      'Check Data Consistency',
      () => {
        const consistency = checkDataConsistency(users, events);
        if (!consistency.isValid) {
          throw new Error(`Consistency issues: ${consistency.issues.join(', ')}`);
        }
        return consistency;
      }
    );
  }

  private async runAPITests(): Promise<void> {
    console.log('🔌 Running API Tests...');
    
    // Test AI content generation
    const poemResult = await this.runTest(
      'Generate AI Poem',
      async () => {
        const poem = await generateContent({
          description: 'A beautiful sunset over the ocean with vibrant colors',
          type: 'poem',
          eventId: 'test_event_1'
        });
        
        if (!poem.content || poem.content.length < 10) {
          throw new Error('Generated poem is too short');
        }
        
        return poem;
      }
    );
    
    const imageResult = await this.runTest(
      'Generate AI Image',
      async () => {
        const image = await generateContent({
          description: 'Abstract art with geometric shapes and bright colors',
          type: 'image',
          eventId: 'test_event_1'
        });
        
        if (!image.content.startsWith('http')) {
          throw new Error('Generated image is not a valid URL');
        }
        
        return image;
      }
    );
    
    // Test art description analysis
    const analysisResult = await this.runTest(
      'Analyze Art Description',
      async () => {
        const analysis = await analyzeArtDescription(
          'A mesmerizing digital landscape with flowing colors and geometric patterns'
        );
        
        if (!analysis.style || !analysis.mood || analysis.elements.length === 0) {
          throw new Error('Analysis result is incomplete');
        }
        
        return analysis;
      }
    );
    
    // Test mock API calls
    const mockResult = await this.runTest(
      'Mock API Call',
      async () => {
        const data = await mockApiCall({ test: 'data' });
        if (!data || data.test !== 'data') {
          throw new Error('Mock API call failed');
        }
        return data;
      }
    );
  }

  private async runPerformanceTests(): Promise<void> {
    console.log('⚡ Running Performance Tests...');
    
    // Test data loading performance
    const loadUsersResult = await this.runTest(
      'Load Demo Users Performance',
      async () => {
        const { result, duration } = await measurePerformance(
          () => Promise.resolve(generateDemoUsers()),
          'Load Demo Users'
        );
        
        if (duration > 100) {
          throw new Error(`Loading users took too long: ${duration}ms`);
        }
        
        return { userCount: result.length, duration };
      }
    );
    
    const loadEventsResult = await this.runTest(
      'Load Demo Events Performance',
      async () => {
        const { result, duration } = await measurePerformance(
          () => Promise.resolve(generateDemoEvents()),
          'Load Demo Events'
        );
        
        if (duration > 100) {
          throw new Error(`Loading events took too long: ${duration}ms`);
        }
        
        return { eventCount: result.length, duration };
      }
    );
    
    // Test AI generation performance
    const aiPerformanceResult = await this.runTest(
      'AI Generation Performance',
      async () => {
        const { result, duration } = await measurePerformance(
          () => generateContent({
            description: 'Test description for performance testing',
            type: 'poem',
            eventId: 'test_event_1'
          }),
          'AI Content Generation'
        );
        
        if (duration > 5000) {
          throw new Error(`AI generation took too long: ${duration}ms`);
        }
        
        return { content: result.content, duration };
      }
    );
  }

  private async runIntegrationTests(): Promise<void> {
    console.log('🔗 Running Integration Tests...');
    
    // Test complete user flow
    const userFlowResult = await this.runTest(
      'Complete User Flow',
      async () => {
        // 1. Load demo data
        const users = generateDemoUsers();
        const events = generateDemoEvents();
        
        // 2. Find an end user
        const endUser = users.find(u => u.role === 'end_user');
        if (!endUser) {
          throw new Error('No end user found in demo data');
        }
        
        // 3. Find a public event
        const publicEvent = events.find(e => e.isPublic && e.status === 'confirmed');
        if (!publicEvent) {
          throw new Error('No public event found in demo data');
        }
        
        // 4. Submit art description
        const description = 'A beautiful abstract painting with vibrant colors';
        const content = await generateContent({
          description,
          type: 'poem',
          eventId: publicEvent.id,
          userId: endUser.id
        });
        
        // 5. Validate the flow
        if (!content.content || content.description !== description) {
          throw new Error('Content generation flow failed');
        }
        
        return {
          userId: endUser.id,
          eventId: publicEvent.id,
          contentId: content.id
        };
      }
    );
    
    // Test artist booking flow
    const bookingFlowResult = await this.runTest(
      'Artist Booking Flow',
      async () => {
        const users = generateDemoUsers();
        const events = generateDemoEvents();
        
        // Find event planner and artist
        const planner = users.find(u => u.role === 'event_planner');
        const artist = users.find(u => u.role === 'artist');
        
        if (!planner || !artist) {
          throw new Error('Required users not found for booking flow');
        }
        
        // Create a new event
        const newEvent: any = {
          id: 'test_booking_event',
          title: 'Test Booking Event',
          description: 'Test event for booking flow',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          location: 'Test Location',
          eventPlannerId: planner.id,
          artists: [artist.id],
          status: 'draft',
          contractStatus: 'pending',
          verified: false,
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Validate the event
        const validation = validateEvent(newEvent);
        if (!validation.isValid) {
          throw new Error(`Event validation failed: ${validation.errors.join(', ')}`);
        }
        
        return {
          plannerId: planner.id,
          artistId: artist.id,
          eventId: newEvent.id
        };
      }
    );
  }

  private async runSystemTests(): Promise<void> {
    console.log('🖥️ Running System Tests...');
    
    // Test network connectivity
    const networkResult = await this.runTest(
      'Network Connectivity',
      async () => {
        const connectivity = await testNetworkConnectivity();
        if (!connectivity.isConnected) {
          throw new Error('Network connectivity test failed');
        }
        return connectivity;
      }
    );
    
    // Test local storage (if available)
    const storageResult = await this.runTest(
      'Local Storage',
      () => {
        const storage = testLocalStorage();
        if (!storage.isAvailable) {
          throw new Error(`Local storage not available: ${storage.error}`);
        }
        return storage;
      }
    );
    
    // Test data structure integrity
    const dataIntegrityResult = await this.runTest(
      'Data Structure Integrity',
      () => {
        const users = generateDemoUsers();
        const events = generateDemoEvents();
        const chats = generateDemoChats();
        const messages = generateDemoMessages();
        
        // Check that all data structures are properly formed
        if (users.length === 0) throw new Error('No users generated');
        if (events.length === 0) throw new Error('No events generated');
        if (chats.length === 0) throw new Error('No chats generated');
        if (messages.length === 0) throw new Error('No messages generated');
        
        return {
          userCount: users.length,
          eventCount: events.length,
          chatCount: chats.length,
          messageCount: messages.length
        };
      }
    );
  }

  private async runTest<T>(
    name: string,
    testFn: () => Promise<T> | T
  ): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      const result = await testFn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const testResult: TestResult = {
        name,
        passed: true,
        duration,
        details: result
      };
      
      this.results.push(testResult);
      console.log(`✓ ${name} (${duration.toFixed(2)}ms)`);
      
      return testResult;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const testResult: TestResult = {
        name,
        passed: false,
        duration,
        error: (error as Error).message,
        details: error
      };
      
      this.results.push(testResult);
      console.log(`✗ ${name} (${duration.toFixed(2)}ms) - ${(error as Error).message}`);
      
      return testResult;
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }

  getSummary(): {
    total: number;
    passed: number;
    failed: number;
    successRate: number;
  } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const successRate = total > 0 ? (passed / total) * 100 : 0;
    
    return {
      total,
      passed,
      failed,
      successRate
    };
  }
}

// Export singleton instance
export const testRunner = new AppTestRunner();

// Convenience function to run all tests
export const runAllTests = async (): Promise<string> => {
  return await testRunner.runAllTests();
};

// Export for use in other files
export default AppTestRunner; 