import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { TrendingUp, Calendar, Target, Zap, Weight, ScanLine, Droplets, Plus, ChartBar as BarChart3, Utensils } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getWeightEntries, getFoodEntries, getUserSettings, formatWeight, formatVolume } from '@/utils/storage';
import { WeightEntry, FoodEntry, UserSettings } from '@/types';

const { width } = Dimensions.get('window');

function getStyles(darkMode: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 24,
      paddingBottom: 32,
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
    },
    headerTop: {
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    temperature: {
      fontSize: 24,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
    },
    greeting: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 4,
    },
    date: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 32,
    },
    statCard: {
      width: (width - 64) / 2,
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    statLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      marginLeft: 8,
    },
    statValue: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 8,
    },
    statTarget: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#52525B' : '#9CA3AF',
    },
    progressBar: {
      height: 4,
      backgroundColor: darkMode ? '#27272A' : '#F3F4F6',
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 16,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    quickActionCard: {
      width: (width - 60) / 2,
      height: 80,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
    },
    blueAction: {
      borderColor: '#3B82F6',
    },
    greenAction: {
      borderColor: '#10B981',
    },
    purpleAction: {
      borderColor: '#8B5CF6',
    },
    orangeAction: {
      borderColor: '#F97316',
    },
    quickActionText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginTop: 8,
    },
    waterButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    waterButton: {
      flex: 1,
      height: 80,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderWidth: 2,
      borderColor: darkMode ? '#3B3B3B' : '#E5E7EB',
    },
    waterButtonActive: {
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
    },
    waterButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#3B82F6',
      marginTop: 8,
    },
    waterButtonTextActive: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginTop: 8,
    },
  });
}

export default function Dashboard() {
  const router = useRouter();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayWater, setTodayWater] = useState(0);
  const [todayMeals, setTodayMeals] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [settings, setSettings] = useState<UserSettings>({
    useMetricWeight: true,
    useMetricVolume: true,
    notificationsEnabled: true,
    darkModeEnabled: false,
  });

  const styles = getStyles(settings.darkModeEnabled);

  // Load data when component mounts
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Reload data when screen comes into focus (e.g., returning from settings)
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      const weights = await getWeightEntries();
      const foods = await getFoodEntries();
      const userSettings = await getUserSettings();
      
      setWeightEntries(weights);
      setSettings(userSettings);
      
      // Calculate today's data
      const today = new Date().toDateString();
      const todayFoods = foods.filter(food => 
        new Date(food.date).toDateString() === today
      );
      const calories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
      setTodayCalories(calories);
      setTodayMeals(todayFoods.length);

      // Get current weight
      if (weights.length > 0) {
        setCurrentWeight(weights[weights.length - 1].weight);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const addWater = (amountOz: number) => {
    // Convert oz to ml for internal storage
    const amountMl = amountOz * 29.5735; // 1 oz = 29.5735 ml
    setTodayWater(prev => prev + amountMl);
  };

  const handleLogWeight = () => {
    router.push('/(tabs)/weight');
  };

  const handleLogMeal = () => {
    router.push('/(tabs)/scanner');
  };

  const handleProgress = () => {
    router.push('/(tabs)/analytics');
  };

  const handleMealsList = () => {
    router.push('/(tabs)/meals');
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getWaterDisplay = () => {
    if (settings.useMetricVolume) {
      const targetMl = 2000; // 8 cups = ~2000ml
      return `${Math.round(todayWater)}ml / ${targetMl}ml`;
    } else {
      const ozConsumed = Math.round((todayWater / 29.5735) * 10) / 10;
      const targetOz = 64; // 8 cups = 64 oz
      return `${ozConsumed}oz / ${targetOz}oz`;
    }
  };

  const getCalorieProgress = () => {
    const target = settings.dailyCalorieGoal ? parseInt(settings.dailyCalorieGoal, 10) : 2000;
    const percentage = Math.min((todayCalories / target) * 100, 100);
    return percentage;
  };

  const getWaterProgress = () => {
    const targetMl = 2000;
    const percentage = Math.min((todayWater / targetMl) * 100, 100);
    return percentage;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.temperature}>98°</Text>
        </View>
        <Text style={styles.greeting}>Good morning!</Text>
        <Text style={styles.date}>{getCurrentDate()}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Zap size={20} color="#EF4444" />
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <Text style={styles.statValue}>
              {todayCalories} <Text style={styles.statTarget}>/ {settings.dailyCalorieGoal ? settings.dailyCalorieGoal : 2000}</Text>
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${getCalorieProgress()}%`, backgroundColor: '#EF4444' }]} />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Droplets size={20} color="#3B82F6" />
              <Text style={styles.statLabel}>Water</Text>
            </View>
            <Text style={styles.statValue}>
              {getWaterDisplay()}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${getWaterProgress()}%`, backgroundColor: '#3B82F6' }]} />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Weight size={20} color="#8B5CF6" />
              <Text style={styles.statLabel}>Weight</Text>
            </View>
            <Text style={styles.statValue}>
              {currentWeight > 0 ? formatWeight(currentWeight, settings.useMetricWeight) : '0 ' + (settings.useMetricWeight ? 'kg' : 'lbs')}
            </Text>
          </View>

          <TouchableOpacity style={styles.statCard} onPress={handleMealsList}>
            <View style={styles.statHeader}>
              <Utensils size={20} color="#10B981" />
              <Text style={styles.statLabel}>Meals</Text>
            </View>
            <Text style={styles.statValue}>{todayMeals}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.quickActionCard, styles.blueAction]} onPress={() => addWater(8)}>
              <Plus size={24} color="#3B82F6" />
              <Text style={styles.quickActionText}>Add Water</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickActionCard, styles.greenAction]} onPress={handleLogMeal}>
              <Plus size={24} color="#10B981" />
              <Text style={styles.quickActionText}>Log Meal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickActionCard, styles.purpleAction]} onPress={handleLogWeight}>
              <Weight size={24} color="#8B5CF6" />
              <Text style={styles.quickActionText}>Weight In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickActionCard, styles.orangeAction]} onPress={handleProgress}>
              <BarChart3 size={24} color="#F97316" />
              <Text style={styles.quickActionText}>Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Water Intake */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Intake</Text>
          <View style={styles.waterButtons}>
            <TouchableOpacity 
              style={[styles.waterButton, styles.waterButtonActive]} 
              onPress={() => addWater(8)}
            >
              <Droplets size={20} color="#FFFFFF" />
              <Text style={styles.waterButtonTextActive}>8oz</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.waterButton} 
              onPress={() => addWater(16)}
            >
              <Droplets size={20} color="#3B82F6" />
              <Text style={styles.waterButtonText}>16oz</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.waterButton} 
              onPress={() => addWater(24)}
            >
              <Droplets size={20} color="#3B82F6" />
              <Text style={styles.waterButtonText}>24oz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}