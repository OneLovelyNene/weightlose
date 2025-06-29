import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Plus, TrendingDown, TrendingUp, Calendar, X } from 'lucide-react-native';
import { getWeightEntries, saveWeightEntry, getUserSettings, formatWeight, kgToLbs, lbsToKg } from '@/utils/storage';
import { WeightEntry, UserSettings } from '@/types';

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
    statsSection: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 32,
    },
    statCard: {
      flex: 1,
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      marginBottom: 8,
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    progressValue: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
    },
    noDataText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#52525B' : '#9CA3AF',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 16,
    },
    historyList: {
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    historyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#3F3F46' : '#F3F4F6',
    },
    historyLeft: {
      flex: 1,
    },
    historyWeight: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 4,
    },
    historyDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    historyDate: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    historyRight: {
      alignItems: 'flex-end',
    },
    changeChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    changePositive: {
      backgroundColor: darkMode ? '#065F46' : '#D1FAE5',
    },
    changeNegative: {
      backgroundColor: darkMode ? '#7F1D1D' : '#FEE2E2',
    },
    changeText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
    },
    changeTextPositive: {
      color: darkMode ? '#34D399' : '#10B981',
    },
    changeTextNegative: {
      color: darkMode ? '#FCA5A5' : '#EF4444',
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
    modalContainer: {
      flex: 1,
      backgroundColor: darkMode ? '#18181B' : '#FFFFFF',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 60,
      paddingHorizontal: 24,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#27272A' : '#F3F4F6',
    },
    modalTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
    },
    modalContent: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#374151',
      marginBottom: 8,
    },
    weightInput: {
      borderWidth: 1,
      borderColor: darkMode ? '#27272A' : '#D1D5DB',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
    },
    input: {
      borderWidth: 1,
      borderColor: darkMode ? '#27272A' : '#D1D5DB',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
    },
    helperText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      marginTop: 8,
    },
    modalFooter: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingVertical: 24,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: darkMode ? '#27272A' : '#F3F4F6',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    cancelModalButton: {
      backgroundColor: darkMode ? '#27272A' : '#F3F4F6',
    },
    saveModalButton: {
      backgroundColor: '#3B82F6',
    },
    cancelModalButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    saveModalButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });
}

export default function Weight() {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
      const entries = await getWeightEntries();
      const userSettings = await getUserSettings();
      setWeightEntries(entries);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading weight entries:', error);
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight value.');
      return;
    }

    try {
      let weightInKg = parseFloat(newWeight);
      
      // Convert to kg if user entered in lbs
      if (!settings.useMetricWeight) {
        weightInKg = lbsToKg(weightInKg);
      }

      const weightEntry: WeightEntry = {
        id: Date.now().toString(),
        weight: weightInKg, // Always store in kg
        date: new Date(selectedDate).toISOString(),
      };

      await saveWeightEntry(weightEntry);
      await loadData();
      setShowAddModal(false);
      setNewWeight('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      Alert.alert('Success', 'Weight entry added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save weight entry. Please try again.');
    }
  };

  const getWeightChange = (currentIndex: number) => {
    if (currentIndex === 0) return null;
    const current = weightEntries[currentIndex].weight;
    const previous = weightEntries[currentIndex - 1].weight;
    return current - previous;
  };

  const getCurrentWeight = () => {
    return weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : 0;
  };

  const getWeightProgress = () => {
    if (weightEntries.length < 2) return null;
    const latest = weightEntries[weightEntries.length - 1].weight;
    const oldest = weightEntries[0].weight;
    return oldest - latest;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatWeightChange = (change: number) => {
    const absChange = Math.abs(change);
    if (settings.useMetricWeight) {
      return `${change > 0 ? '+' : ''}${change.toFixed(1)} kg`;
    } else {
      return `${change > 0 ? '+' : ''}${kgToLbs(change).toFixed(1)} lbs`;
    }
  };

  const getProgressDisplay = () => {
    const progress = getWeightProgress();
    if (progress === null) return 'No data yet';
    
    const absProgress = Math.abs(progress);
    if (settings.useMetricWeight) {
      return `${progress > 0 ? '-' : '+'}${absProgress.toFixed(1)} kg`;
    } else {
      return `${progress > 0 ? '-' : '+'}${kgToLbs(absProgress).toFixed(1)} lbs`;
    }
  };

  const styles = getStyles(settings.darkModeEnabled);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weight Tracking</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Current Weight Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Current Weight</Text>
            <Text style={styles.statValue}>
              {formatWeight(getCurrentWeight(), settings.useMetricWeight)}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Progress</Text>
            <View style={styles.progressRow}>
              {getWeightProgress() !== null ? (
                <>
                  {getWeightProgress()! > 0 ? (
                    <TrendingDown size={16} color="#10B981" />
                  ) : (
                    <TrendingUp size={16} color="#EF4444" />
                  )}
                  <Text style={[
                    styles.progressValue,
                    { color: getWeightProgress()! > 0 ? '#10B981' : '#EF4444' }
                  ]}>
                    {getProgressDisplay()}
                  </Text>
                </>
              ) : (
                <Text style={styles.noDataText}>No data yet</Text>
              )}
            </View>
          </View>
        </View>

        {/* Weight History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight History</Text>
          
          {weightEntries.length > 0 ? (
            <View style={styles.historyList}>
              {weightEntries.slice().reverse().map((entry, index) => {
                const originalIndex = weightEntries.length - 1 - index;
                const change = getWeightChange(originalIndex);
                
                return (
                  <View key={entry.id} style={styles.historyItem}>
                    <View style={styles.historyLeft}>
                      <Text style={styles.historyWeight}>
                        {formatWeight(entry.weight, settings.useMetricWeight)}
                      </Text>
                      <View style={styles.historyDateRow}>
                        <Calendar size={14} color={settings.darkModeEnabled ? '#A1A1AA' : '#6B7280'} />
                        <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.historyRight}>
                      {change !== null && (
                        <View style={[
                          styles.changeChip,
                          change < 0 ? styles.changePositive : styles.changeNegative
                        ]}>
                          {change < 0 ? (
                            <TrendingDown size={12} color={settings.darkModeEnabled ? '#34D399' : '#10B981'} />
                          ) : (
                            <TrendingUp size={12} color={settings.darkModeEnabled ? '#FCA5A5' : '#EF4444'} />
                          )}
                          <Text style={[
                            styles.changeText,
                            change < 0 ? styles.changeTextPositive : styles.changeTextNegative
                          ]}>
                            {formatWeightChange(change)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No weight entries yet</Text>
              <Text style={styles.emptyStateText}>
                Start tracking your weight by adding your first entry
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => setShowAddModal(true)}
              >
                <Plus size={20} color="#3B82F6" />
                <Text style={styles.emptyStateButtonText}>Add Weight Entry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Weight Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Weight Entry</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color={settings.darkModeEnabled ? '#A1A1AA' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Weight ({settings.useMetricWeight ? 'kg' : 'lbs'}) *
              </Text>
              <TextInput
                style={styles.weightInput}
                value={newWeight}
                onChangeText={setNewWeight}
                placeholder={`Enter your weight in ${settings.useMetricWeight ? 'kg' : 'lbs'}`}
                placeholderTextColor={settings.darkModeEnabled ? '#A1A1AA' : '#9CA3AF'}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date *</Text>
              <TextInput
                style={styles.input}
                value={selectedDate}
                onChangeText={setSelectedDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={settings.darkModeEnabled ? '#A1A1AA' : '#9CA3AF'}
              />
            </View>

            <Text style={styles.helperText}>
              * Required fields
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelModalButton]}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelModalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveModalButton]}
              onPress={handleAddWeight}
            >
              <Text style={styles.saveModalButtonText}>Add Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}