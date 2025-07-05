import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
} 