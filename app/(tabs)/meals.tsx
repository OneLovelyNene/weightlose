import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Plus, Calendar, Trash2 } from 'lucide-react-native';
import { getFoodEntries, getUserSettings, deleteFoodEntry } from '@/utils/storage';
import { FoodEntry, UserSettings } from '@/types';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

function getStyles(darkMode: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 60,
      paddingHorizontal: 24,
      paddingBottom: 24,
      backgroundColor: darkMode ? '#18181B' : '#FFFFFF',
    },
    title: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#3B82F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    statsCard: {
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statsTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 16,
    },
    mealsList: {
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    mealItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#3F3F46' : '#F3F4F6',
    },
    mealLeft: {
      flex: 1,
    },
    mealName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 4,
    },
    mealCalories: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: '#EF4444',
      marginBottom: 2,
    },
    mealMacros: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    mealDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    mealDate: {
      fontSize: 11,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#52525B' : '#9CA3AF',
    },
    mealRight: {
      alignItems: 'flex-end',
      gap: 8,
    },
    deleteButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: darkMode ? '#7F1D1D' : '#FEE2E2',
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyState: {
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      textAlign: 'center',
      marginBottom: 24,
    },
    emptyStateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#3B82F6',
    },
    emptyStateButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#3B82F6',
    },
  });
}

export default function MealsScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<FoodEntry[]>([]);
  const [todayMeals, setTodayMeals] = useState<FoodEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    useMetricWeight: true,
    useMetricVolume: true,
    notificationsEnabled: true,
    darkModeEnabled: false,
  });

  const loadData = async () => {
    try {
      const allMeals = await getFoodEntries();
      const userSettings = await getUserSettings();
      const today = new Date().toDateString();
      const todayMealsFiltered = allMeals.filter(meal => 
        new Date(meal.date).toDateString() === today
      );
      
      setMeals(allMeals);
      setTodayMeals(todayMealsFiltered);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleDeleteMeal = async (mealId: string) => {
    try {
      await deleteFoodEntry(mealId);
      await loadData();
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handleAddMeal = () => {
    router.push('/(tabs)/scanner');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTodayStats = () => {
    const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.carbs, 0);
    const totalFat = todayMeals.reduce((sum, meal) => sum + meal.fat, 0);

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const stats = getTodayStats();
  const styles = getStyles(settings.darkModeEnabled);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meals</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMeal}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Today's Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Today's Nutrition</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalCalories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(stats.totalProtein)}g</Text>
              <Text style={styles.statLabel}>Protein</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(stats.totalCarbs)}g</Text>
              <Text style={styles.statLabel}>Carbs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(stats.totalFat)}g</Text>
              <Text style={styles.statLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Meals List */}
        <Text style={styles.sectionTitle}>Recent Meals</Text>
        
        {meals.length > 0 ? (
          <View style={styles.mealsList}>
            <FlatList
              data={meals.slice(0, 20)} // Show last 20 meals
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={[
                  styles.mealItem,
                  index === meals.length - 1 && { borderBottomWidth: 0 }
                ]}>
                  <View style={styles.mealLeft}>
                    <Text style={styles.mealName}>{item.name}</Text>
                    <Text style={styles.mealCalories}>{item.calories} kcal</Text>
                    <Text style={styles.mealMacros}>
                      P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                    </Text>
                    <View style={styles.mealDateRow}>
                      <Calendar size={10} color={settings.darkModeEnabled ? '#52525B' : '#9CA3AF'} />
                      <Text style={styles.mealDate}>{formatDate(item.date)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.mealRight}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMeal(item.id)}
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No meals logged yet</Text>
            <Text style={styles.emptyStateText}>
              Start tracking your nutrition by adding your first meal
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={handleAddMeal}
            >
              <Plus size={20} color="#3B82F6" />
              <Text style={styles.emptyStateButtonText}>Add Meal</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}