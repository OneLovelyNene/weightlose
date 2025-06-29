import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeightEntry, FoodEntry, UserSettings } from '@/types';

const WEIGHT_ENTRIES_KEY = 'weight_entries';
const FOOD_ENTRIES_KEY = 'food_entries';
const USER_SETTINGS_KEY = 'user_settings';

// Default settings
const DEFAULT_SETTINGS: UserSettings = {
  useMetricWeight: true,
  useMetricVolume: true,
  notificationsEnabled: true,
  darkModeEnabled: false,
  weightGoal: '75.0',
  dailyCalorieGoal: '2000',
};

// Weight Entries
export const getWeightEntries = async (): Promise<WeightEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(WEIGHT_ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading weight entries:', error);
    return [];
  }
};

export const saveWeightEntry = async (entry: WeightEntry): Promise<void> => {
  try {
    const existingEntries = await getWeightEntries();
    const updatedEntries = [...existingEntries, entry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    await AsyncStorage.setItem(WEIGHT_ENTRIES_KEY, JSON.stringify(updatedEntries));
  } catch (error) {
    console.error('Error saving weight entry:', error);
    throw error;
  }
};

export const deleteWeightEntry = async (id: string): Promise<void> => {
  try {
    const existingEntries = await getWeightEntries();
    const filteredEntries = existingEntries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(WEIGHT_ENTRIES_KEY, JSON.stringify(filteredEntries));
  } catch (error) {
    console.error('Error deleting weight entry:', error);
    throw error;
  }
};

// Food Entries
export const getFoodEntries = async (): Promise<FoodEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading food entries:', error);
    return [];
  }
};

export const saveFoodEntry = async (entry: FoodEntry): Promise<void> => {
  try {
    const existingEntries = await getFoodEntries();
    const updatedEntries = [...existingEntries, entry].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    await AsyncStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(updatedEntries));
  } catch (error) {
    console.error('Error saving food entry:', error);
    throw error;
  }
};

export const deleteFoodEntry = async (id: string): Promise<void> => {
  try {
    const existingEntries = await getFoodEntries();
    const filteredEntries = existingEntries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(filteredEntries));
  } catch (error) {
    console.error('Error deleting food entry:', error);
    throw error;
  }
};

// User Settings
export const getUserSettings = async (): Promise<UserSettings> => {
  try {
    const data = await AsyncStorage.getItem(USER_SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading user settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([WEIGHT_ENTRIES_KEY, FOOD_ENTRIES_KEY, USER_SETTINGS_KEY]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

// Unit conversion utilities
export const kgToLbs = (kg: number): number => kg * 2.20462;
export const lbsToKg = (lbs: number): number => lbs / 2.20462;
export const mlToOz = (ml: number): number => ml * 0.033814;
export const ozToMl = (oz: number): number => oz / 0.033814;

export const formatWeight = (weight: number, useMetric: boolean): string => {
  if (useMetric) {
    return `${weight.toFixed(1)} kg`;
  } else {
    return `${kgToLbs(weight).toFixed(1)} lbs`;
  }
};

export const formatVolume = (ml: number, useMetric: boolean): string => {
  if (useMetric) {
    return `${ml}ml`;
  } else {
    return `${mlToOz(ml).toFixed(1)}oz`;
  }
};