import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EventsScreen from '../screens/EventsScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventHistoryScreen from '../screens/EventHistoryScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import ArtistProfileScreen from '../screens/ArtistProfileScreen';
import ArtistSearchScreen from '../screens/ArtistSearchScreen';
import ArtistDetailScreen from '../screens/ArtistDetailScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import { useUserRole } from '../hooks/useUserRole';

const Tab = createBottomTabNavigator();
const ChatStack = createStackNavigator();
const EventPlannerStack = createStackNavigator();

function ChatStackNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChatList" component={ChatScreen} />
      <ChatStack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </ChatStack.Navigator>
  );
}

function EventPlannerStackNavigator() {
  return (
    <EventPlannerStack.Navigator screenOptions={{ headerShown: false }}>
      <EventPlannerStack.Screen name="ArtistSearch" component={ArtistSearchScreen} />
      <EventPlannerStack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
      <EventPlannerStack.Screen name="CreateEvent" component={CreateEventScreen} />
    </EventPlannerStack.Navigator>
  );
}

function EventsStackNavigator() {
  return (
    <EventPlannerStack.Navigator screenOptions={{ headerShown: false }}>
      <EventPlannerStack.Screen name="EventsList" component={EventsScreen} />
      <EventPlannerStack.Screen name="EventDetail" component={EventDetailScreen} />
      <EventPlannerStack.Screen name="EventHistory" component={EventHistoryScreen} />
    </EventPlannerStack.Navigator>
  );
}

export default function MainTabNavigator() {
  const { isArtist, isEventPlanner, isEndUser } = useUserRole();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#181818',
          borderTopColor: '#282828',
        },
        tabBarActiveTintColor: '#1DB954',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      
      {isEventPlanner && (
        <Tab.Screen 
          name="FindArtists" 
          component={EventPlannerStackNavigator}
          options={{ title: 'Find Artists' }}
        />
      )}
      
      <Tab.Screen 
        name="Events" 
        component={EventsStackNavigator}
        options={{ title: 'Events' }}
      />
      
      <Tab.Screen 
        name="Chat" 
        component={ChatStackNavigator}
        options={{ title: 'Messages' }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={isArtist ? ArtistProfileScreen : ProfileScreen}
        options={{ title: isArtist ? 'Artist Profile' : 'Profile' }}
      />
    </Tab.Navigator>
  );
} 