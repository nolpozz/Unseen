import React, { createContext, useContext, ReactNode } from 'react';
import { DarkTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeContext.Provider value={{}}>
    <NavigationThemeProvider value={DarkTheme}>{children}</NavigationThemeProvider>
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext); 