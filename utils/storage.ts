import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeightEntry, FoodEntry, UserSettings, UserProfile } from '@/types';

const WEIGHT_ENTRIES_KEY = 'weight_entries';
const FOOD_ENTRIES_KEY = 'food_entries';
const USER_SETTINGS_KEY = 'user_settings';
const USER_PROFILE_KEY = 'user_profile';

// Default settings
const DEFAULT_SETTINGS: UserSettings = {
  useMetricWeight: true,
  useMetricVolume: true,
  notificationsEnabled: true,
  darkModeEnabled: false,
  weightGoal: '75.0',
  dailyCalorieGoal: '2000',
  region: 'metric',
};

// Default profile
const DEFAULT_PROFILE: UserProfile = {
  id: 'default_user',
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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

// User Profile
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const updatedProfile = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
  } catch (error) {
    console.error('Error saving user profile:', error);
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
    await AsyncStorage.multiRemove([WEIGHT_ENTRIES_KEY, FOOD_ENTRIES_KEY, USER_SETTINGS_KEY, USER_PROFILE_KEY]);
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
export const celsiusToFahrenheit = (celsius: number): number => (celsius * 9/5) + 32;
export const fahrenheitToCelsius = (fahrenheit: number): number => (fahrenheit - 32) * 5/9;
export const cmToFeet = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};
export const feetToCm = (feet: number, inches: number): number => {
  return (feet * 12 + inches) * 2.54;
};

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

export const formatTemperature = (celsius: number, useMetric: boolean): string => {
  if (useMetric) {
    return `${celsius}°C`;
  } else {
    return `${Math.round(celsiusToFahrenheit(celsius))}°F`;
  }
};

export const formatHeight = (cm: number, useMetric: boolean): string => {
  if (useMetric) {
    return `${cm} cm`;
  } else {
    const { feet, inches } = cmToFeet(cm);
    return `${feet}'${inches}"`;
  }
};

// BMI and health calculations
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateBMR = (weightKg: number, heightCm: number, age: number, gender: string): number => {
  // Mifflin-St Jeor Equation
  const baseRate = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? baseRate + 5 : baseRate - 161;
};

export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };
  return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2);
};