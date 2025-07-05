import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUserEventHistory, Event } from '../api/events';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface EventHistoryCardProps {
  event: Event;
  onPress: () => void;
}

const EventHistoryCard: React.FC<EventHistoryCardProps> = ({ event, onPress }) => {
  const { colors } = useTheme();
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getGeneratedContentCount = () => {
    return event.generatedContent?.length || 0;
  };

  return (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.eventHeader}>
        <Text style={[styles.eventTitle, { color: colors.text }]}>
          {event.title}
        </Text>
        <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
          {formatDate(event.date)}
        </Text>
      </View>
      
      <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>
        {event.location}
      </Text>
      
      <View style={styles.eventStats}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={16} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {event.artists.length} Artist{event.artists.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="sparkles" size={16} color={colors.primary} />
          <Text style={[styles.statText, { color: colors.primary }]}>
            {getGeneratedContentCount()} Content
          </Text>
        </View>
      </View>
      
      {event.generatedContent && event.generatedContent.length > 0 && (
        <View style={styles.contentPreview}>
          <Text style={[styles.contentPreviewTitle, { color: colors.text }]}>
            Your Generated Content:
          </Text>
          {event.generatedContent.slice(0, 2).map((content) => (
            <View key={content.id} style={styles.contentItem}>
              <Ionicons 
                name={content.type === 'poem' ? 'book' : 'image'} 
                size={14} 
                color={colors.textSecondary} 
              />
              <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                {content.description.substring(0, 50)}...
              </Text>
            </View>
          ))}
          {event.generatedContent.length > 2 && (
            <Text style={[styles.moreContent, { color: colors.primary }]}>
              +{event.generatedContent.length - 2} more
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const EventHistoryScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();

  const loadEventHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const history = await getUserEventHistory(user.uid);
      setEvents(history);
    } catch (error) {
      console.error('Error loading event history:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEventHistory();
    setRefreshing(false);
  };

  useEffect(() => {
    loadEventHistory();
  }, [user]);

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetail' as never, { eventId: event.id } as never);
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <EventHistoryCard event={item} onPress={() => handleEventPress(item)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="time-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Event History
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Attend events to see them here
      </Text>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Events' as never)}
      >
        <Text style={[styles.browseButtonText, { color: colors.white }]}>
          Browse Events
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Login Required
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Please log in to view your event history
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Event History</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  eventDate: {
    fontSize: 14,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 12,
  },
  eventStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
  },
  contentPreview: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  contentPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contentText: {
    marginLeft: 6,
    fontSize: 12,
    flex: 1,
  },
  moreContent: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventHistoryScreen; 