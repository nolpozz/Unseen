import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useUserRole } from '../hooks/useUserRole';

export default function HomeScreen() {
  const { userData } = useAuth();
  const { isArtist, isEventPlanner, isEndUser, profileComplete, profileProgress } = useUserRole();

  const getWelcomeMessage = () => {
    if (isArtist) {
      return `Welcome back, ${userData?.displayName || 'Artist'}!`;
    } else if (isEventPlanner) {
      return `Welcome back, ${userData?.displayName || 'Event Planner'}!`;
    } else {
      return `Welcome to Unseen, ${userData?.displayName || 'User'}!`;
    }
  };

  const getQuickActions = () => {
    if (isArtist) {
      return [
        { title: 'Update Profile', action: 'profile', color: '#1DB954' },
        { title: 'View Events', action: 'events', color: '#FF6B6B' },
        { title: 'Messages', action: 'messages', color: '#4ECDC4' },
      ];
    } else if (isEventPlanner) {
      return [
        { title: 'Find Artists', action: 'search', color: '#1DB954' },
        { title: 'Create Event', action: 'create', color: '#FF6B6B' },
        { title: 'My Events', action: 'events', color: '#4ECDC4' },
      ];
    } else {
      return [
        { title: 'Browse Events', action: 'events', color: '#1DB954' },
        { title: 'Discover Artists', action: 'artists', color: '#FF6B6B' },
        { title: 'Generated Content', action: 'content', color: '#4ECDC4' },
      ];
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{getWelcomeMessage()}</Text>
        <Text style={styles.subtitle}>
          {isArtist ? 'Ready to showcase your art?' : 
           isEventPlanner ? 'Ready to create amazing events?' : 
           'Discover unique art experiences'}
        </Text>
      </View>

      {/* Profile Completion Alert for Artists */}
      {isArtist && !profileComplete && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>Complete Your Profile</Text>
          <Text style={styles.alertText}>
            You're {profileProgress}% complete. Finish your profile to increase visibility!
          </Text>
          <TouchableOpacity style={styles.alertButton}>
            <Text style={styles.alertButtonText}>Complete Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {getQuickActions().map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={() => {
                // Navigate to appropriate screen
                console.log(`Navigate to ${action.action}`);
              }}
            >
              <Text style={styles.actionButtonText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>No recent activity</Text>
          <Text style={styles.activitySubtext}>
            {isArtist ? 'Your upcoming events and messages will appear here' :
             isEventPlanner ? 'Your event bookings and artist communications will appear here' :
             'Your event attendance and generated content will appear here'}
          </Text>
        </View>
      </View>

      {/* Stats Preview */}
      {isArtist && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData?.artistProfile?.totalEvents || 0}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData?.artistProfile?.rating || 0}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData?.artistProfile?.gallery?.length || 0}</Text>
              <Text style={styles.statLabel}>Artworks</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  alertContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#1DB954',
    borderRadius: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
  },
  alertButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityContainer: {
    padding: 20,
    backgroundColor: '#181818',
    borderRadius: 12,
    alignItems: 'center',
  },
  activityText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  activitySubtext: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 