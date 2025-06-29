export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  weightGoal?: number;
  dailyCalorieGoal?: number;
  createdAt: string;
}

export interface UserSettings {
  useMetricWeight: boolean; // true for kg, false for lbs
  useMetricVolume: boolean; // true for ml, false for oz
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  weightGoal?: string;
  dailyCalorieGoal?: string;
  region?: 'metric' | 'imperial'; // EU vs US/UK
}