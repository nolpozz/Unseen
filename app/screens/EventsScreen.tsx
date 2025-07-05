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
import { getPublicEvents, getUpcomingEvents, Event } from '../api/events';
import { useTheme } from '../context/ThemeContext';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const { colors } = useTheme();
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
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
        <View style={[styles.statusBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.statusText, { color: colors.white }]}>
            {event.status}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
        {event.description}
      </Text>
      
      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {formatDate(event.date)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {formatTime(event.date)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {event.location}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="people" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {event.artists.length} Artist{event.artists.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      {event.generatedContent && event.generatedContent.length > 0 && (
        <View style={styles.contentPreview}>
          <Ionicons name="sparkles" size={16} color={colors.primary} />
          <Text style={[styles.contentText, { color: colors.primary }]}>
            {event.generatedContent.length} AI-generated piece{event.generatedContent.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const EventsScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming'>('all');
  
  const navigation = useNavigation();
  const { colors } = useTheme();

  const loadEvents = async () => {
    try {
      setLoading(true);
      const [publicEvents, upcoming] = await Promise.all([
        getPublicEvents(),
        getUpcomingEvents(5),
      ]);
      setEvents(publicEvents);
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetail' as never, { eventId: event.id } as never);
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCard event={item} onPress={() => handleEventPress(item)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Events Found
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {activeTab === 'upcoming' 
          ? 'No upcoming events at the moment'
          : 'No public events available'
        }
      </Text>
    </View>
  );

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
        <Text style={[styles.title, { color: colors.text }]}>Events</Text>
        <TouchableOpacity
          style={[styles.historyButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('EventHistory' as never)}
        >
          <Ionicons name="time" size={20} color={colors.white} />
          <Text style={[styles.historyButtonText, { color: colors.white }]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'all' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'all' ? colors.white : colors.text }
          ]}>
            All Events
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'upcoming' ? colors.white : colors.text }
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'all' ? events : upcomingEvents}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  historyButtonText: {
    marginLeft: 4,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '600',
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  contentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  contentText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
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
  },
});

export default EventsScreen; 