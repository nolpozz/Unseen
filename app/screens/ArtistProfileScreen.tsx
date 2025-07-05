import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useUserRole } from '../hooks/useUserRole';
import { updateUserProfile } from '../api/users';

export default function ArtistProfileScreen() {
  const { userData } = useAuth();
  const { isArtist } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    bio: userData?.artistProfile?.bio || '',
    style: userData?.artistProfile?.style || '',
    region: userData?.artistProfile?.region || '',
    available: userData?.artistProfile?.availability?.available || false,
  });

  const [profileProgress, setProfileProgress] = useState(0);

  useEffect(() => {
    calculateProfileProgress();
  }, [profile]);

  const calculateProfileProgress = () => {
    const fields = [
      profile.bio,
      profile.style,
      profile.region,
      userData?.artistProfile?.gallery?.length || 0,
    ];
    
    const completedFields = fields.filter(field => 
      typeof field === 'string' ? field.trim().length > 0 : field > 0
    ).length;
    
    const progress = Math.round((completedFields / fields.length) * 100);
    setProfileProgress(progress);
  };

  const handleSave = async () => {
    if (!userData?.id) return;

    setLoading(true);
    try {
      await updateUserProfile(userData.id, {
        artistProfile: {
          ...userData.artistProfile,
          bio: profile.bio,
          style: profile.style,
          region: profile.region,
          availability: {
            available: profile.available,
          },
        },
        profileComplete: profileProgress >= 80,
        profileProgress,
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isArtist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access denied. Artist profile only.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Artist Profile</Text>
        <Text style={styles.subtitle}>{userData?.displayName || userData?.email}</Text>
      </View>

      {/* Profile Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Profile Completion: {profileProgress}%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${profileProgress}%` }]} />
        </View>
        {profileProgress < 80 && (
          <Text style={styles.progressNote}>
            Complete your profile to increase your visibility to event planners
          </Text>
        )}
      </View>

      {/* Bio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bio</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tell us about yourself, your artistic journey, and what makes your work unique..."
          placeholderTextColor="#666"
          value={profile.bio}
          onChangeText={(text) => setProfile({ ...profile, bio: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Style Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Artistic Style</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Abstract Expressionism, Digital Art, Mixed Media..."
          placeholderTextColor="#666"
          value={profile.style}
          onChangeText={(text) => setProfile({ ...profile, style: text })}
        />
      </View>

      {/* Region Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Region</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., New York, NY or Los Angeles, CA"
          placeholderTextColor="#666"
          value={profile.region}
          onChangeText={(text) => setProfile({ ...profile, region: text })}
        />
      </View>

      {/* Availability Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <TouchableOpacity
          style={[styles.availabilityButton, profile.available && styles.availableButton]}
          onPress={() => setProfile({ ...profile, available: !profile.available })}
        >
          <Text style={styles.availabilityText}>
            {profile.available ? 'Available for Events' : 'Not Available'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gallery Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Artwork Gallery</Text>
        <TouchableOpacity style={styles.addImageButton}>
          <Text style={styles.addImageText}>+ Add Artwork</Text>
        </TouchableOpacity>
        <Text style={styles.galleryNote}>
          Upload images of your work to showcase your style and attract event planners
        </Text>
      </View>

      {/* Stats Section */}
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

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    padding: 20,
    paddingTop: 0,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#282828',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 4,
  },
  progressNote: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  availabilityButton: {
    backgroundColor: '#282828',
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  availableButton: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  availabilityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addImageButton: {
    backgroundColor: '#1DB954',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  addImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  galleryNote: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  saveButton: {
    backgroundColor: '#1DB954',
    borderRadius: 8,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
}); 