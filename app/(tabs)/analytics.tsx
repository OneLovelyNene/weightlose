import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Calendar, Target, ChartBar as BarChart3 } from 'lucide-react-native';
import { getWeightEntries, getFoodEntries, getUserSettings, formatWeight, kgToLbs } from '@/utils/storage';
import { WeightEntry, FoodEntry, UserSettings } from '@/types';
import WeightChart from '@/components/WeightChart';

function getStyles(darkMode: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 24,
      paddingBottom: 24,
      backgroundColor: darkMode ? '#18181B' : '#FFFFFF',
    },
    title: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 12,
      padding: 4,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    periodButtonActive: {
      backgroundColor: '#3B82F6',
    },
    periodButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    periodButtonTextActive: {
      color: '#FFFFFF',
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
    statsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    statsTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
    },
    trendBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    trendDown: {
      backgroundColor: '#10B981',
    },
    trendUp: {
      backgroundColor: '#EF4444',
    },
    trendStable: {
      backgroundColor: '#6B7280',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    statItem: {
      flex: 1,
      minWidth: '45%',
      alignItems: 'center',
      padding: 12,
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
      borderRadius: 12,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      marginBottom: 4,
      textAlign: 'center',
    },
    statValue: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      textAlign: 'center',
    },
    insightsCard: {
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
    insightsTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 16,
    },
    insightsList: {
      gap: 16,
    },
    insightItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    insightIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: darkMode ? '#3F3F46' : '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 2,
    },
    insightText: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#4B5563',
      lineHeight: 20,
    },
  });
}

export default function Analytics() {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [settings, setSettings] = useState<UserSettings>({
    useMetricWeight: true,
    useMetricVolume: true,
    notificationsEnabled: true,
    darkModeEnabled: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const weights = await getWeightEntries();
      const foods = await getFoodEntries();
      const userSettings = await getUserSettings();
      setWeightEntries(weights);
      setFoodEntries(foods);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const getFilteredData = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return {
      weights: weightEntries.filter(entry => new Date(entry.date) >= cutoffDate),
      foods: foodEntries.filter(entry => new Date(entry.date) >= cutoffDate),
    };
  };

  const getWeightStats = () => {
    const { weights } = getFilteredData();
    if (weights.length < 2) return null;

    const sortedWeights = [...weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const startWeight = sortedWeights[0].weight;
    const endWeight = sortedWeights[sortedWeights.length - 1].weight;
    const change = endWeight - startWeight;
    const changePercent = ((change / startWeight) * 100);

    return {
      startWeight,
      endWeight,
      change,
      changePercent,
      trend: change < 0 ? 'down' : change > 0 ? 'up' : 'stable',
    };
  };

  const getCalorieStats = () => {
    const { foods } = getFilteredData();
    if (foods.length === 0) return null;

    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
    const avgCalories = totalCalories / foods.length;
    const dailyCalories = foods.reduce((acc, food) => {
      const date = new Date(food.date).toDateString();
      acc[date] = (acc[date] || 0) + food.calories;
      return acc;
    }, {} as Record<string, number>);

    const dailyValues = Object.values(dailyCalories);
    const maxDaily = Math.max(...dailyValues);
    const minDaily = Math.min(...dailyValues);

    return {
      totalCalories,
      avgCalories,
      maxDaily,
      minDaily,
      daysLogged: Object.keys(dailyCalories).length,
    };
  };

  const formatWeightChange = (change: number) => {
    const absChange = Math.abs(change);
    if (settings.useMetricWeight) {
      return `${absChange.toFixed(1)} kg`;
    } else {
      return `${kgToLbs(absChange).toFixed(1)} lbs`;
    }
  };

  const weightStats = getWeightStats();
  const calorieStats = getCalorieStats();

  const styles = getStyles(settings.darkModeEnabled);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your progress over time</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weight Chart */}
        <WeightChart entries={getFilteredData().weights} settings={settings} />

        {/* Weight Statistics */}
        {weightStats && (
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Weight Statistics</Text>
              <View style={[
                styles.trendBadge,
                weightStats.trend === 'down' ? styles.trendDown : 
                weightStats.trend === 'up' ? styles.trendUp : styles.trendStable
              ]}>
                {weightStats.trend === 'down' ? (
                  <TrendingDown size={16} color="#FFFFFF" />
                ) : weightStats.trend === 'up' ? (
                  <TrendingUp size={16} color="#FFFFFF" />
                ) : (
                  <BarChart3 size={16} color="#FFFFFF" />
                )}
              </View>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Start Weight</Text>
                <Text style={styles.statValue}>
                  {formatWeight(weightStats.startWeight, settings.useMetricWeight)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Current Weight</Text>
                <Text style={styles.statValue}>
                  {formatWeight(weightStats.endWeight, settings.useMetricWeight)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Change</Text>
                <Text style={[
                  styles.statValue,
                  { color: weightStats.change < 0 ? (settings.darkModeEnabled ? '#34D399' : '#10B981') : (settings.darkModeEnabled ? '#FCA5A5' : '#EF4444') }
                ]}>
                  {weightStats.change > 0 ? '+' : ''}{formatWeightChange(weightStats.change)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Percentage</Text>
                <Text style={[
                  styles.statValue,
                  { color: weightStats.changePercent < 0 ? (settings.darkModeEnabled ? '#34D399' : '#10B981') : (settings.darkModeEnabled ? '#FCA5A5' : '#EF4444') }
                ]}>
                  {weightStats.changePercent > 0 ? '+' : ''}{weightStats.changePercent.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Calorie Statistics */}
        {calorieStats && (
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Nutrition Statistics</Text>
              <Target size={20} color="#F97316" />
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg Daily Calories</Text>
                <Text style={styles.statValue}>{Math.round(calorieStats.avgCalories)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Calories</Text>
                <Text style={styles.statValue}>{calorieStats.totalCalories.toLocaleString()}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Highest Day</Text>
                <Text style={styles.statValue}>{Math.round(calorieStats.maxDaily)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Days Logged</Text>
                <Text style={styles.statValue}>{calorieStats.daysLogged}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Insights</Text>
          <View style={styles.insightsList}>
            {weightStats && (
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  {weightStats.trend === 'down' ? (
                    <TrendingDown size={16} color={settings.darkModeEnabled ? '#34D399' : '#10B981'} />
                  ) : (
                    <TrendingUp size={16} color={settings.darkModeEnabled ? '#FCA5A5' : '#EF4444'} />
                  )}
                </View>
                <Text style={styles.insightText}>
                  {weightStats.trend === 'down' 
                    ? `Great progress! You've lost ${formatWeightChange(Math.abs(weightStats.change))} this ${selectedPeriod}.`
                    : `You've gained ${formatWeightChange(weightStats.change)} this ${selectedPeriod}. Consider reviewing your goals.`
                  }
                </Text>
              </View>
            )}
            
            {calorieStats && (
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Calendar size={16} color={settings.darkModeEnabled ? '#3B82F6' : '#3B82F6'} />
                </View>
                <Text style={styles.insightText}>
                  You've logged food for {calorieStats.daysLogged} days this {selectedPeriod}. 
                  {calorieStats.daysLogged < 7 ? ' Try to log more consistently for better insights.' : ' Great consistency!'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}