import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useUserRole } from '../hooks/useUserRole';
import { createEvent } from '../api/events';

export default function CreateEventScreen({ route, navigation }: any) {
  const { userData } = useAuth();
  const { isEventPlanner } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });

  const selectedArtist = route.params?.selectedArtist;

  const handleCreateEvent = async () => {
    if (!isEventPlanner) {
      Alert.alert('Error', 'Only event planners can create events');
      return;
    }

    if (!eventData.title || !eventData.description || !eventData.date || !eventData.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const event = await createEvent(
        {
          ...eventData,
          date: new Date(eventData.date),
          artistIds: selectedArtist ? [selectedArtist.id] : [],
        },
        userData!.id
      );

      Alert.alert(
        'Success',
        'Event created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('EventDetail', { eventId: event.id }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isEventPlanner) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access denied. Event planner only.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Event</Text>
        <Text style={styles.subtitle}>Set up your event details and book artists</Text>
      </View>

      {/* Selected Artist */}
      {selectedArtist && (
        <View style={styles.selectedArtistContainer}>
          <Text style={styles.selectedArtistTitle}>Selected Artist</Text>
          <View style={styles.selectedArtistCard}>
            <Text style={styles.selectedArtistName}>{selectedArtist.displayName}</Text>
            <Text style={styles.selectedArtistStyle}>{selectedArtist.artistProfile?.style}</Text>
            <Text style={styles.selectedArtistRegion}>{selectedArtist.artistProfile?.region}</Text>
          </View>
        </View>
      )}

      {/* Event Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title..."
            placeholderTextColor="#666"
            value={eventData.title}
            onChangeText={(text) => setEventData({ ...eventData, title: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your event, theme, and requirements..."
            placeholderTextColor="#666"
            value={eventData.description}
            onChangeText={(text) => setEventData({ ...eventData, description: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#666"
            value={eventData.date}
            onChangeText={(text) => setEventData({ ...eventData, date: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event location..."
            placeholderTextColor="#666"
            value={eventData.location}
            onChangeText={(text) => setEventData({ ...eventData, location: text })}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.createButton]}
          onPress={handleCreateEvent}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>Create Event</Text>
          )}
        </TouchableOpacity>

        {!selectedArtist && (
          <TouchableOpacity
            style={[styles.actionButton, styles.findArtistButton]}
            onPress={() => navigation.navigate('ArtistSearch')}
          >
            <Text style={styles.actionButtonText}>Find Artists</Text>
          </TouchableOpacity>
        )}
      </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  selectedArtistContainer: {
    padding: 20,
    paddingTop: 0,
  },
  selectedArtistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  selectedArtistCard: {
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1DB954',
  },
  selectedArtistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  selectedArtistStyle: {
    fontSize: 14,
    color: '#1DB954',
    marginBottom: 4,
  },
  selectedArtistRegion: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    padding: 20,
    paddingTop: 0,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
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
  createButton: {
    backgroundColor: '#1DB954',
  },
  findArtistButton: {
    backgroundColor: '#282828',
    borderWidth: 1,
    borderColor: '#666',
  },
  actionButtonText: {
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