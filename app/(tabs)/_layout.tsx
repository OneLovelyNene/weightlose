import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, ScanLine, Weight, User, ChartBar as BarChart3, Utensils } from 'lucide-react-native';
import { getUserSettings } from '@/utils/storage';
import { UserSettings } from '@/types';
import { useFocusEffect } from '@react-navigation/native';

export default function TabLayout() {
  const [settings, setSettings] = useState<UserSettings>({
    useMetricWeight: true,
    useMetricVolume: true,
    notificationsEnabled: true,
    darkModeEnabled: false,
  });

  const loadSettings = async () => {
    try {
      const userSettings = await getUserSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Reload settings when any tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: settings.darkModeEnabled ? '#A1A1AA' : '#9CA3AF',
        tabBarStyle: {
          backgroundColor: settings.darkModeEnabled ? '#18181B' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: settings.darkModeEnabled ? '#27272A' : '#F3F4F6',
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ size, color }) => (
            <ScanLine size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          tabBarIcon: ({ size, color }) => (
            <Utensils size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          title: 'Weight',
          tabBarIcon: ({ size, color }) => (
            <Weight size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}