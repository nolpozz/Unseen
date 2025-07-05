import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
} 