import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, TextInput, Modal } from 'react-native';
import { User, Target, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit3, Save, X, Scale, Droplets, Globe } from 'lucide-react-native';
import { clearAllData, getUserSettings, saveUserSettings } from '@/utils/storage';
import { UserSettings } from '@/types';

interface UserGoals {
  weightGoal: string;
  dailyCalorieGoal: string;
}

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
    profileSection: {
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    avatarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: darkMode ? '#18181B' : '#EBF4FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    editButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: darkMode ? '#27272A' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    section: {
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      padding: 20,
      paddingBottom: 12,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#27272A' : '#F3F4F6',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuItemText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginLeft: 12,
    },
    unitInfo: {
      marginLeft: 12,
      flex: 1,
    },
    unitSubtext: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      marginTop: 2,
    },
    menuItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    menuItemValue: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    regionSelector: {
      flexDirection: 'row',
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
      borderRadius: 8,
      padding: 2,
    },
    regionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      minWidth: 40,
      alignItems: 'center',
    },
    regionButtonActive: {
      backgroundColor: '#3B82F6',
    },
    regionButtonText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    regionButtonTextActive: {
      color: '#FFFFFF',
    },
    dangerItem: {
      borderBottomColor: darkMode ? '#7F1D1D' : '#FEE2E2',
    },
    dangerText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: '#EF4444',
      marginLeft: 12,
    },
    appInfo: {
      alignItems: 'center',
      paddingVertical: 24,
      gap: 4,
    },
    appInfoText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#52525B' : '#9CA3AF',
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
    goalTips: {
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
      borderRadius: 12,
      padding: 16,
      marginTop: 20,
    },
    tipsTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 8,
    },
    tipText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      marginBottom: 4,
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

export default function Profile() {
  const [settings, setSettings] = useState<UserSettings>({
    useMetricWeight: true,
    useMetricVolume: true,
    notificationsEnabled: true,
    darkModeEnabled: false,
    weightGoal: '75.0',
    dailyCalorieGoal: '2000',
    region: 'metric', // 'metric' for EU/metric, 'imperial' for US/UK
  });
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [goals, setGoals] = useState<UserGoals>({
    weightGoal: settings.weightGoal || '75.0',
    dailyCalorieGoal: settings.dailyCalorieGoal || '2000',
  });
  const [tempGoals, setTempGoals] = useState<UserGoals>(goals);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await getUserSettings();
      setSettings(userSettings);
      setGoals({
        weightGoal: userSettings.weightGoal || '75.0',
        dailyCalorieGoal: userSettings.dailyCalorieGoal || '2000',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: boolean | string) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await saveUserSettings(newSettings);
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('Error', 'Failed to update setting. Please try again.');
    }
  };

  const handleRegionChange = async (region: 'metric' | 'imperial') => {
    try {
      const newSettings = {
        ...settings,
        region,
        useMetricWeight: region === 'metric',
        useMetricVolume: region === 'metric',
      };
      setSettings(newSettings);
      await saveUserSettings(newSettings);
    } catch (error) {
      console.error('Error updating region:', error);
      Alert.alert('Error', 'Failed to update region settings. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your weight entries, food logs, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await clearAllData();
              // Reset to default settings
              setSettings({
                useMetricWeight: true,
                useMetricVolume: true,
                notificationsEnabled: true,
                darkModeEnabled: false,
                region: 'metric',
              });
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleSaveGoals = async () => {
    try {
      const newGoals = { ...tempGoals };
      setGoals(newGoals);
      
      // Update settings with new goals
      const newSettings = {
        ...settings,
        weightGoal: newGoals.weightGoal,
        dailyCalorieGoal: newGoals.dailyCalorieGoal,
      };
      
      // Save to storage
      await saveUserSettings(newSettings);
      setSettings(newSettings);
      setShowGoalsModal(false);
      Alert.alert('Success', 'Your goals have been updated!');
    } catch (error) {
      console.error('Error saving goals:', error);
      Alert.alert('Error', 'Failed to save goals. Please try again.');
    }
  };

  const openGoalsModal = () => {
    setTempGoals(goals);
    setShowGoalsModal(true);
  };

  const getRegionDisplayText = () => {
    return settings.region === 'metric' ? 'Metric (EU)' : 'Imperial (US/UK)';
  };

  const styles = getStyles(settings.darkModeEnabled);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={32} color="#3B82F6" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals & Targets</Text>
          <TouchableOpacity style={styles.menuItem} onPress={openGoalsModal}>
            <View style={styles.menuItemLeft}>
              <Target size={20} color="#10B981" />
              <Text style={styles.menuItemText}>Weight Goal</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>
                {goals.weightGoal} {settings.useMetricWeight ? 'kg' : 'lbs'}
              </Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={openGoalsModal}>
            <View style={styles.menuItemLeft}>
              <Target size={20} color="#F97316" />
              <Text style={styles.menuItemText}>Daily Calories</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>{goals.dailyCalorieGoal} kcal</Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Regional Units Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regional Units</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Globe size={20} color="#3B82F6" />
              <View style={styles.unitInfo}>
                <Text style={styles.menuItemText}>Unit System</Text>
                <Text style={styles.unitSubtext}>
                  {getRegionDisplayText()}
                </Text>
              </View>
            </View>
            <View style={styles.regionSelector}>
              <TouchableOpacity
                style={[
                  styles.regionButton,
                  settings.region === 'metric' && styles.regionButtonActive
                ]}
                onPress={() => handleRegionChange('metric')}
              >
                <Text style={[
                  styles.regionButtonText,
                  settings.region === 'metric' && styles.regionButtonTextActive
                ]}>
                  EU
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.regionButton,
                  settings.region === 'imperial' && styles.regionButtonActive
                ]}
                onPress={() => handleRegionChange('imperial')}
              >
                <Text style={[
                  styles.regionButtonText,
                  settings.region === 'imperial' && styles.regionButtonTextActive
                ]}>
                  US/UK
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Scale size={20} color="#8B5CF6" />
              <View style={styles.unitInfo}>
                <Text style={styles.menuItemText}>Weight Units</Text>
                <Text style={styles.unitSubtext}>
                  {settings.useMetricWeight ? 'Kilograms (kg)' : 'Pounds (lbs)'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.useMetricWeight}
              onValueChange={(value) => updateSetting('useMetricWeight', value)}
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Droplets size={20} color="#3B82F6" />
              <View style={styles.unitInfo}>
                <Text style={styles.menuItemText}>Volume Units</Text>
                <Text style={styles.unitSubtext}>
                  {settings.useMetricVolume ? 'Milliliters (ml)' : 'Fluid Ounces (oz)'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.useMetricVolume}
              onValueChange={(value) => updateSetting('useMetricVolume', value)}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Bell size={20} color="#F97316" />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) => updateSetting('notificationsEnabled', value)}
              trackColor={{ false: '#D1D5DB', true: '#F97316' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <Switch
              value={settings.darkModeEnabled}
              onValueChange={(value) => updateSetting('darkModeEnabled', value)}
              trackColor={{ false: '#D1D5DB', true: '#6B7280' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <HelpCircle size={20} color="#8B5CF6" />
              <Text style={styles.menuItemText}>Help & FAQ</Text>
            </View>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.dangerItem]}
            onPress={handleClearData}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.dangerText}>Clear All Data</Text>
            </View>
            <ChevronRight size={16} color="#EF4444" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.dangerItem]}
            onPress={handleLogout}
          >
            <View style={styles.menuItemLeft}>
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.dangerText}>Logout</Text>
            </View>
            <ChevronRight size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Weight Tracker v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with ❤️ for your health journey</Text>
        </View>
      </ScrollView>

      {/* Goals Modal */}
      <Modal
        visible={showGoalsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Goals</Text>
            <TouchableOpacity onPress={() => setShowGoalsModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Weight Goal ({settings.useMetricWeight ? 'kg' : 'lbs'})
              </Text>
              <TextInput
                style={styles.input}
                value={tempGoals.weightGoal}
                onChangeText={(text) => setTempGoals({...tempGoals, weightGoal: text})}
                placeholder="Enter target weight"
                keyboardType="decimal-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Daily Calorie Goal</Text>
              <TextInput
                style={styles.input}
                value={tempGoals.dailyCalorieGoal}
                onChangeText={(text) => setTempGoals({...tempGoals, dailyCalorieGoal: text})}
                placeholder="Enter daily calorie target"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.goalTips}>
              <Text style={styles.tipsTitle}>Goal Setting Tips</Text>
              <Text style={styles.tipText}>• Set realistic and achievable targets</Text>
              <Text style={styles.tipText}>• Aim for 0.5-1 kg (1-2 lbs) weight loss per week</Text>
              <Text style={styles.tipText}>• Consult a healthcare provider for personalized advice</Text>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelModalButton]}
              onPress={() => setShowGoalsModal(false)}
            >
              <Text style={styles.cancelModalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveModalButton]}
              onPress={handleSaveGoals}
            >
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveModalButtonText}>Save Goals</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}