import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { generateDemoUsers, generateDemoEvents, getDemoData } from '../utils/demoData';
import { runAllTests } from '../utils/testRunner';
import { generateContent, analyzeArtDescription } from '../api/ai';

const DemoScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string>('');
  const [demoData, setDemoData] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);
  
  const { colors } = useTheme();

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    const users = generateDemoUsers();
    const events = generateDemoEvents();
    setDemoData({ users, events });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadDemoData();
    setRefreshing(false);
  };

  const runTestSuite = async () => {
    setLoading(true);
    try {
      const results = await runAllTests();
      setTestResults(results);
      Alert.alert('Test Complete', 'All tests have been completed. Check the results below.');
    } catch (error) {
      Alert.alert('Test Error', `Failed to run tests: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAIGeneration = async () => {
    setLoading(true);
    try {
      const poem = await generateContent({
        description: 'A beautiful sunset over the ocean with vibrant colors',
        type: 'poem',
        eventId: 'demo_event'
      });
      
      const image = await generateContent({
        description: 'Abstract art with geometric shapes and bright colors',
        type: 'image',
        eventId: 'demo_event'
      });
      
      const analysis = await analyzeArtDescription(
        'A mesmerizing digital landscape with flowing colors and geometric patterns'
      );
      
      Alert.alert('AI Test Complete', 
        `Poem: ${poem.content.substring(0, 50)}...\n\n` +
        `Image: ${image.content}\n\n` +
        `Analysis: ${analysis.style} style, ${analysis.mood} mood`
      );
    } catch (error) {
      Alert.alert('AI Test Error', `Failed to test AI generation: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const showDemoData = (type: string) => {
    const data = getDemoData(type as any);
    Alert.alert(
      `Demo ${type}`,
      `Found ${data.length} ${type}:\n\n` +
      data.slice(0, 3).map((item: any) => 
        `${item.displayName || item.title || item.id}`
      ).join('\n') +
      (data.length > 3 ? `\n... and ${data.length - 3} more` : '')
    );
  };

  const DemoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );

  const DemoButton: React.FC<{
    title: string;
    onPress: () => void;
    icon: string;
    color?: string;
  }> = ({ title, onPress, icon, color = colors.primary }) => (
    <TouchableOpacity
      style={[styles.demoButton, { backgroundColor: color }]}
      onPress={onPress}
      disabled={loading}
    >
      <Ionicons name={icon as any} size={20} color={colors.white} />
      <Text style={[styles.demoButtonText, { color: colors.white }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>App Demo & Testing</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Test all app features and view demo data
        </Text>
      </View>

      <DemoSection title="🧪 Test Suite">
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Run comprehensive tests to validate app functionality
        </Text>
        <DemoButton
          title="Run All Tests"
          onPress={runTestSuite}
          icon="play-circle"
          color={colors.primary}
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Running tests...
            </Text>
          </View>
        )}
      </DemoSection>

      <DemoSection title="🤖 AI Features">
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Test AI content generation and analysis
        </Text>
        <DemoButton
          title="Test AI Generation"
          onPress={testAIGeneration}
          icon="sparkles"
          color={colors.secondary}
        />
      </DemoSection>

      <DemoSection title="📊 Demo Data">
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          View sample data for testing
        </Text>
        <View style={styles.buttonRow}>
          <DemoButton
            title="Users"
            onPress={() => showDemoData('users')}
            icon="people"
          />
          <DemoButton
            title="Events"
            onPress={() => showDemoData('events')}
            icon="calendar"
          />
        </View>
        <View style={styles.buttonRow}>
          <DemoButton
            title="Chats"
            onPress={() => showDemoData('chats')}
            icon="chatbubbles"
          />
          <DemoButton
            title="Messages"
            onPress={() => showDemoData('messages')}
            icon="mail"
          />
        </View>
      </DemoSection>

      <DemoSection title="📈 Data Statistics">
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {demoData.users?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Users
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {demoData.events?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Events
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {demoData.events?.filter((e: any) => e.isPublic)?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Public Events
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {demoData.users?.filter((u: any) => u.role === 'artist')?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Artists
            </Text>
          </View>
        </View>
      </DemoSection>

      {testResults && (
        <DemoSection title="📋 Test Results">
          <ScrollView style={styles.resultsContainer}>
            <Text style={[styles.resultsText, { color: colors.text }]}>
              {testResults}
            </Text>
          </ScrollView>
          <DemoButton
            title="Clear Results"
            onPress={() => setTestResults('')}
            icon="trash"
            color={colors.error || '#ff4444'}
          />
        </DemoSection>
      )}

      <DemoSection title="🔧 Quick Actions">
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Common testing actions
        </Text>
        <View style={styles.buttonRow}>
          <DemoButton
            title="Reload Data"
            onPress={loadDemoData}
            icon="refresh"
          />
          <DemoButton
            title="Validate Data"
            onPress={() => {
              const users = generateDemoUsers();
              const events = generateDemoEvents();
              Alert.alert('Data Validation', 
                `Users: ${users.length}\nEvents: ${events.length}\n\nAll data structures are valid!`
              );
            }}
            icon="checkmark-circle"
          />
        </View>
      </DemoSection>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Demo mode - All data is simulated for testing purposes
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  demoButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  resultsContainer: {
    maxHeight: 200,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  resultsText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DemoScreen; 