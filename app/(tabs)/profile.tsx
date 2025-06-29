import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, TextInput, Modal } from 'react-native';
import { User, Target, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit3, Save, X, Scale, Droplets, Globe, Activity, Calendar, Ruler, UserCheck } from 'lucide-react-native';
import { clearAllData, getUserSettings, saveUserSettings, getUserProfile, saveUserProfile, formatWeight, formatHeight, calculateBMI, getBMICategory, calculateBMR, calculateTDEE, cmToFeet, feetToCm } from '@/utils/storage';
import { UserSettings, UserProfile } from '@/types';

interface UserGoals {
  weightGoal: string;
  dailyCalorieGoal: string;
}

interface ProfileData {
  name: string;
  email: string;
  age: string;
  height: string;
  activityLevel: string;
  gender: string;
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
    profileStats: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#52525B' : '#9CA3AF',
      marginTop: 4,
    },
    editButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: darkMode ? '#27272A' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    healthSection: {
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
    healthTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 16,
    },
    healthGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    healthCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    healthValue: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 4,
    },
    healthLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      textAlign: 'center',
    },
    bmiCategory: {
      fontSize: 10,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#52525B' : '#9CA3AF',
      marginTop: 2,
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
    pickerContainer: {
      borderWidth: 1,
      borderColor: darkMode ? '#27272A' : '#D1D5DB',
      borderRadius: 12,
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
    },
    pickerButton: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pickerText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#F3F4F6' : '#1F2937',
    },
    pickerPlaceholder: {
      color: darkMode ? '#A1A1AA' : '#9CA3AF',
    },
    pickerOptions: {
      borderTopWidth: 1,
      borderTopColor: darkMode ? '#3F3F46' : '#E5E7EB',
    },
    pickerOption: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#3F3F46' : '#F3F4F6',
    },
    pickerOptionText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#F3F4F6' : '#1F2937',
    },
    heightInputRow: {
      flexDirection: 'row',
      gap: 12,
    },
    heightInput: {
      flex: 1,
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
    region: 'metric',
  });
  const [profile, setProfile] = useState<UserProfile>({
    id: 'default_user',
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [goals, setGoals] = useState<UserGoals>({
    weightGoal: settings.weightGoal || '75.0',
    dailyCalorieGoal: settings.dailyCalorieGoal || '2000',
  });
  const [tempGoals, setTempGoals] = useState<UserGoals>(goals);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: profile.name,
    email: profile.email,
    age: profile.age?.toString() || '',
    height: profile.height?.toString() || '',
    activityLevel: profile.activityLevel || 'moderately_active',
    gender: profile.gender || 'male',
  });
  const [tempProfileData, setTempProfileData] = useState<ProfileData>(profileData);
  const [showActivityPicker, setShowActivityPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userSettings = await getUserSettings();
      const userProfile = await getUserProfile();
      setSettings(userSettings);
      setProfile(userProfile);
      setGoals({
        weightGoal: userSettings.weightGoal || '75.0',
        dailyCalorieGoal: userSettings.dailyCalorieGoal || '2000',
      });
      setProfileData({
        name: userProfile.name,
        email: userProfile.email,
        age: userProfile.age?.toString() || '',
        height: userProfile.height?.toString() || '',
        activityLevel: userProfile.activityLevel || 'moderately_active',
        gender: userProfile.gender || 'male',
      });
    } catch (error) {
      console.error('Error loading data:', error);
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
      
      const newSettings = {
        ...settings,
        weightGoal: newGoals.weightGoal,
        dailyCalorieGoal: newGoals.dailyCalorieGoal,
      };
      
      await saveUserSettings(newSettings);
      setSettings(newSettings);
      setShowGoalsModal(false);
      Alert.alert('Success', 'Your goals have been updated!');
    } catch (error) {
      console.error('Error saving goals:', error);
      Alert.alert('Error', 'Failed to save goals. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        name: tempProfileData.name,
        email: tempProfileData.email,
        age: tempProfileData.age ? parseInt(tempProfileData.age) : undefined,
        height: tempProfileData.height ? parseFloat(tempProfileData.height) : undefined,
        activityLevel: tempProfileData.activityLevel as any,
        gender: tempProfileData.gender as any,
      };

      await saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
      setProfileData(tempProfileData);
      setShowProfileModal(false);
      Alert.alert('Success', 'Your profile has been updated!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const openGoalsModal = () => {
    setTempGoals(goals);
    setShowGoalsModal(true);
  };

  const openProfileModal = () => {
    setTempProfileData(profileData);
    setShowProfileModal(true);
  };

  const getRegionDisplayText = () => {
    return settings.region === 'metric' ? 'Metric (EU)' : 'Imperial (US/UK)';
  };

  const getActivityLevelText = (level: string) => {
    const levels = {
      sedentary: 'Sedentary (Little/no exercise)',
      lightly_active: 'Lightly Active (Light exercise 1-3 days/week)',
      moderately_active: 'Moderately Active (Moderate exercise 3-5 days/week)',
      very_active: 'Very Active (Hard exercise 6-7 days/week)',
      extremely_active: 'Extremely Active (Very hard exercise, physical job)',
    };
    return levels[level as keyof typeof levels] || 'Moderately Active';
  };

  const getGenderText = (gender: string) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const getHealthStats = () => {
    if (!profile.height || !profile.age) return null;

    const currentWeight = 75; // This would come from latest weight entry
    const bmi = calculateBMI(currentWeight, profile.height);
    const bmr = calculateBMR(currentWeight, profile.height, profile.age, profile.gender || 'male');
    const tdee = calculateTDEE(bmr, profile.activityLevel || 'moderately_active');

    return { bmi, bmr, tdee };
  };

  const formatHeightInput = (height: string) => {
    if (!height) return '';
    const heightNum = parseFloat(height);
    if (settings.region === 'imperial') {
      const { feet, inches } = cmToFeet(heightNum);
      return `${feet}'${inches}"`;
    }
    return `${heightNum} cm`;
  };

  const styles = getStyles(settings.darkModeEnabled);
  const healthStats = getHealthStats();

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
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
              {profile.age && profile.height && (
                <Text style={styles.profileStats}>
                  {profile.age} years • {formatHeightInput(profile.height.toString())}
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.editButton} onPress={openProfileModal}>
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Overview */}
        {healthStats && (
          <View style={styles.healthSection}>
            <Text style={styles.healthTitle}>Health Overview</Text>
            <View style={styles.healthGrid}>
              <View style={styles.healthCard}>
                <Text style={styles.healthValue}>{healthStats.bmi.toFixed(1)}</Text>
                <Text style={styles.healthLabel}>BMI</Text>
                <Text style={styles.bmiCategory}>{getBMICategory(healthStats.bmi)}</Text>
              </View>
              <View style={styles.healthCard}>
                <Text style={styles.healthValue}>{Math.round(healthStats.bmr)}</Text>
                <Text style={styles.healthLabel}>BMR (kcal/day)</Text>
              </View>
              <View style={styles.healthCard}>
                <Text style={styles.healthValue}>{Math.round(healthStats.tdee)}</Text>
                <Text style={styles.healthLabel}>TDEE (kcal/day)</Text>
              </View>
              <View style={styles.healthCard}>
                <Text style={styles.healthValue}>{getActivityLevelText(profile.activityLevel || 'moderately_active').split(' ')[0]}</Text>
                <Text style={styles.healthLabel}>Activity Level</Text>
              </View>
            </View>
          </View>
        )}

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

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowProfileModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={tempProfileData.name}
                onChangeText={(text) => setTempProfileData({...tempProfileData, name: text})}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={tempProfileData.email}
                onChangeText={(text) => setTempProfileData({...tempProfileData, email: text})}
                placeholder="Enter your email"
                keyboardType="email-address"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                value={tempProfileData.age}
                onChangeText={(text) => setTempProfileData({...tempProfileData, age: text})}
                placeholder="Enter your age"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Height ({settings.region === 'metric' ? 'cm' : 'feet & inches'})
              </Text>
              {settings.region === 'metric' ? (
                <TextInput
                  style={styles.input}
                  value={tempProfileData.height}
                  onChangeText={(text) => setTempProfileData({...tempProfileData, height: text})}
                  placeholder="Enter height in cm"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              ) : (
                <View style={styles.heightInputRow}>
                  <View style={styles.heightInput}>
                    <TextInput
                      style={styles.input}
                      value={tempProfileData.height ? cmToFeet(parseFloat(tempProfileData.height)).feet.toString() : ''}
                      onChangeText={(feet) => {
                        const inches = tempProfileData.height ? cmToFeet(parseFloat(tempProfileData.height)).inches : 0;
                        const cm = feetToCm(parseInt(feet) || 0, inches);
                        setTempProfileData({...tempProfileData, height: cm.toString()});
                      }}
                      placeholder="Feet"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={styles.heightInput}>
                    <TextInput
                      style={styles.input}
                      value={tempProfileData.height ? cmToFeet(parseFloat(tempProfileData.height)).inches.toString() : ''}
                      onChangeText={(inches) => {
                        const feet = tempProfileData.height ? cmToFeet(parseFloat(tempProfileData.height)).feet : 0;
                        const cm = feetToCm(feet, parseInt(inches) || 0);
                        setTempProfileData({...tempProfileData, height: cm.toString()});
                      }}
                      placeholder="Inches"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowGenderPicker(!showGenderPicker)}
                >
                  <Text style={[styles.pickerText, !tempProfileData.gender && styles.pickerPlaceholder]}>
                    {tempProfileData.gender ? getGenderText(tempProfileData.gender) : 'Select gender'}
                  </Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </TouchableOpacity>
                {showGenderPicker && (
                  <View style={styles.pickerOptions}>
                    {['male', 'female', 'other'].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={styles.pickerOption}
                        onPress={() => {
                          setTempProfileData({...tempProfileData, gender});
                          setShowGenderPicker(false);
                        }}
                      >
                        <Text style={styles.pickerOptionText}>{getGenderText(gender)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Activity Level</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowActivityPicker(!showActivityPicker)}
                >
                  <Text style={styles.pickerText}>
                    {getActivityLevelText(tempProfileData.activityLevel)}
                  </Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </TouchableOpacity>
                {showActivityPicker && (
                  <View style={styles.pickerOptions}>
                    {[
                      'sedentary',
                      'lightly_active',
                      'moderately_active',
                      'very_active',
                      'extremely_active'
                    ].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={styles.pickerOption}
                        onPress={() => {
                          setTempProfileData({...tempProfileData, activityLevel: level});
                          setShowActivityPicker(false);
                        }}
                      >
                        <Text style={styles.pickerOptionText}>{getActivityLevelText(level)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelModalButton]}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={styles.cancelModalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveModalButton]}
              onPress={handleSaveProfile}
            >
              <UserCheck size={16} color="#FFFFFF" />
              <Text style={styles.saveModalButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}