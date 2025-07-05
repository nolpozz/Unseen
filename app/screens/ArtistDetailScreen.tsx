import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useUserRole } from '../hooks/useUserRole';
import GalleryGrid from '../components/GalleryGrid';
import { bookArtist } from '../api/events';

export default function ArtistDetailScreen({ route, navigation }: any) {
  const { artist } = route.params;
  const { isEventPlanner } = useUserRole();
  const [loading, setLoading] = useState(false);

  const handleBookArtist = async () => {
    if (!isEventPlanner) {
      Alert.alert('Error', 'Only event planners can book artists');
      return;
    }

    setLoading(true);
    try {
      // Navigate to event creation screen with artist pre-selected
      navigation.navigate('CreateEvent', { selectedArtist: artist });
    } catch (error) {
      Alert.alert('Error', 'Failed to book artist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageArtist = () => {
    // Navigate to chat with artist
    navigation.navigate('Chat', { artistId: artist.id, artistName: artist.displayName });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{artist.displayName || 'Artist'}</Text>
        <Text style={styles.style}>{artist.artistProfile?.style}</Text>
        <Text style={styles.region}>{artist.artistProfile?.region}</Text>
        
        {artist.artistProfile?.availability?.available && (
          <View style={styles.availableBadge}>
            <Text style={styles.availableText}>Available for Events</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{artist.artistProfile?.totalEvents || 0}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{artist.artistProfile?.rating || 0}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{artist.artistProfile?.gallery?.length || 0}</Text>
          <Text style={styles.statLabel}>Artworks</Text>
        </View>
      </View>

      {/* Bio */}
      {artist.artistProfile?.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{artist.artistProfile.bio}</Text>
        </View>
      )}

      {/* Gallery */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Artwork Gallery</Text>
        <GalleryGrid 
          items={artist.artistProfile?.gallery || []}
          onItemPress={(item) => {
            // Navigate to full image view
            navigation.navigate('ImageView', { image: item });
          }}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.bookButton]}
          onPress={handleBookArtist}
          disabled={loading || !artist.artistProfile?.availability?.available}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>Book Artist</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={handleMessageArtist}
        >
          <Text style={styles.actionButtonText}>Message Artist</Text>
        </TouchableOpacity>
      </View>

      {/* Past Events */}
      {artist.artistProfile?.pastEvents && artist.artistProfile.pastEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Events</Text>
          <Text style={styles.pastEventsText}>
            This artist has participated in {artist.artistProfile.pastEvents.length} events.
          </Text>
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
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  style: {
    fontSize: 18,
    color: '#1DB954',
    marginBottom: 4,
  },
  region: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  availableBadge: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availableText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#181818',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
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
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: '#1DB954',
  },
  messageButton: {
    backgroundColor: '#282828',
    borderWidth: 1,
    borderColor: '#666',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pastEventsText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
}); 