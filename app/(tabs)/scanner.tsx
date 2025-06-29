import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, ScrollView, FlatList } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, X, Plus, Search, Check, Loader as Loader2, CircleAlert as AlertCircle, Bug } from 'lucide-react-native';
import { Platform } from 'react-native';
import { saveFoodEntry, getUserSettings } from '@/utils/storage';
import { nutritionixAPI, convertNutritionixToFoodData, testNutritionixAPI, NutritionixFood } from '@/utils/nutritionix';
import { FoodEntry, UserSettings } from '@/types';

// Mock nutrition database for fallback when API is not available
const NUTRITION_DATABASE: Record<string, any> = {
  'default': {
    name: 'Scanned Product',
    calories: 150,
    protein: 5,
    carbs: 20,
    fat: 8,
  }
};

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
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    debugButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: darkMode ? '#27272A' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: darkMode ? '#7F1D1D' : '#FEE2E2',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 24,
      marginTop: 16,
      borderRadius: 8,
      gap: 8,
    },
    errorText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#FCA5A5' : '#DC2626',
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
    },
    permissionTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginTop: 24,
      marginBottom: 12,
      textAlign: 'center',
    },
    permissionText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
    },
    permissionButton: {
      backgroundColor: '#3B82F6',
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 12,
    },
    permissionButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
    },
    loadingTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 12,
      textAlign: 'center',
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
    },
    camera: {
      flex: 1,
    },
    scannerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scannerFrame: {
      width: 280,
      height: 200,
      borderWidth: 3,
      borderColor: '#3B82F6',
      borderRadius: 12,
      backgroundColor: 'transparent',
    },
    scannerText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginTop: 24,
      textAlign: 'center',
    },
    scannerSubtext: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.8)',
      marginTop: 8,
      textAlign: 'center',
    },
    cancelButton: {
      position: 'absolute',
      top: 60,
      right: 24,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionSection: {
      gap: 16,
      marginBottom: 24,
    },
    actionCard: {
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    scanCard: {
      backgroundColor: '#3B82F6',
    },
    searchCard: {
      backgroundColor: '#8B5CF6',
    },
    manualCard: {
      backgroundColor: '#10B981',
    },
    actionIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    actionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    actionDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      lineHeight: 20,
    },
    debugSection: {
      marginBottom: 24,
    },
    testButton: {
      backgroundColor: '#F97316',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
    },
    testButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    tipsSection: {
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
    tipsTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 16,
    },
    tip: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    tipNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      textAlign: 'center',
      lineHeight: 24,
      marginRight: 12,
    },
    tipText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#4B5563',
      flex: 1,
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
    debugHeaderButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    clearButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: '#EF4444',
      borderRadius: 6,
    },
    clearButtonText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    debugContent: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    debugLogText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#374151',
      marginBottom: 8,
      lineHeight: 16,
    },
    noLogsText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#52525B' : '#9CA3AF',
      textAlign: 'center',
      marginTop: 32,
    },
    searchContainer: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#27272A' : '#F3F4F6',
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#F3F4F6' : '#1F2937',
    },
    searchResults: {
      flex: 1,
    },
    searchLoadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 32,
      gap: 12,
    },
    searchLoadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    searchResultItem: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#27272A' : '#F3F4F6',
    },
    searchResultContent: {
      gap: 4,
    },
    searchResultName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
    },
    searchResultBrand: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    searchResultCalories: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#52525B' : '#9CA3AF',
    },
    emptySearchContainer: {
      paddingVertical: 48,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    emptySearchText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      textAlign: 'center',
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
    servingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: '#3B82F6',
      backgroundColor: darkMode ? '#18181B' : '#EBF4FF',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
    },
    sectionLabel: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 16,
      marginTop: 8,
    },
    nutritionRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    nutritionInput: {
      flex: 1,
    },
    nutritionSummary: {
      backgroundColor: darkMode ? '#18181B' : '#F8FAFC',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    summaryTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
    },
    summaryValue: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
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

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [foodData, setFoodData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    serving: '',
  });
  const [settings, setSettings] = useState<UserSettings>({
    useMetricWeight: true,
    useMetricVolume: true,
    notificationsEnabled: true,
    darkModeEnabled: false,
  });

  // Use useCallback to prevent re-creating the function on every render
  const addDebugLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  // Store original console methods
  const originalConsole = useRef({
    log: console.log,
    error: console.error,
    warn: console.warn,
  });

  // Override console methods to capture logs - but do it safely
  React.useEffect(() => {
    const { log, error, warn } = originalConsole.current;

    console.log = (...args) => {
      log(...args);
      // Use setTimeout to avoid state updates during render
      setTimeout(() => {
        addDebugLog(`LOG: ${args.join(' ')}`);
      }, 0);
    };

    console.error = (...args) => {
      error(...args);
      // Use setTimeout to avoid state updates during render
      setTimeout(() => {
        addDebugLog(`ERROR: ${args.join(' ')}`);
      }, 0);
    };

    console.warn = (...args) => {
      warn(...args);
      // Use setTimeout to avoid state updates during render
      setTimeout(() => {
        addDebugLog(`WARN: ${args.join(' ')}`);
      }, 0);
    };

    return () => {
      console.log = log;
      console.error = error;
      console.warn = warn;
    };
  }, [addDebugLog]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await getUserSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const styles = getStyles(settings.darkModeEnabled);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#3B82F6" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera permission to scan food barcodes and help you track your nutrition
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const testAPI = async () => {
    console.log('🧪 Manual API test initiated');
    
    try {
      setIsLoading(true);
      const success = await testNutritionixAPI();
      
      if (success) {
        Alert.alert('API Test', 'API connection successful!');
      } else {
        Alert.alert('API Test', 'API connection failed. Check debug logs for details.');
      }
    } catch (error) {
      Alert.alert('API Test', `API test error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNutritionDataByBarcode = async (barcode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📱 Fetching nutrition data for barcode:', barcode);
      
      const nutritionData = await nutritionixAPI.searchByBarcode(barcode);
      
      if (nutritionData) {
        console.log('✅ Nutrition data found:', nutritionData);
        
        const convertedData = convertNutritionixToFoodData(nutritionData);
        setFoodData(convertedData);
        setIsLoading(false);
        setShowFoodModal(true);
      } else {
        console.log('ℹ️ Product not found in database');
        
        // Product not found in Nutritionix, use fallback
        setFoodData({
          name: 'Unknown Product',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          serving: '',
        });
        setIsLoading(false);
        setShowFoodModal(true);
        Alert.alert(
          'Product Not Found',
          'This product was not found in our database. Please enter the nutrition information manually.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      setIsLoading(false);
      setError('Failed to fetch nutrition data');
      console.error('❌ Nutrition API error:', error);
      
      // Fallback to manual entry
      setFoodData({
        name: 'Scanned Product',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        serving: '',
      });
      setShowFoodModal(true);
      Alert.alert(
        'API Error',
        `Unable to fetch nutrition data: ${error}. Please enter the information manually.`,
        [
          { text: 'View Debug Logs', onPress: () => setShowDebugModal(true) },
          { text: 'OK' }
        ]
      );
    }
  };

  const searchFoods = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      
      console.log('🔍 Searching for foods:', query);
      
      const results = await nutritionixAPI.getInstantSearch(query);
      console.log('✅ Search results:', results.length);
      
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('❌ Search error:', error);
      setError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = async (item: any) => {
    try {
      setIsLoading(true);
      setShowSearchModal(false);
      
      console.log('🎯 Selected search result:', item);
      
      // Get detailed nutrition info
      const foods = await nutritionixAPI.searchFood(item.food_name);
      
      if (foods.length > 0) {
        console.log('✅ Detailed nutrition data:', foods[0]);
        
        const convertedData = convertNutritionixToFoodData(foods[0]);
        setFoodData(convertedData);
        setShowFoodModal(true);
      }
    } catch (error) {
      console.error('❌ Error getting food details:', error);
      Alert.alert('Error', 'Failed to get food details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setIsScanning(false);
    
    console.log('📱 Barcode scanned:', { type, data });
    
    if (Platform.OS === 'web') {
      // Web fallback - simulate barcode scan with mock data
      console.log('🌐 Web platform detected, using mock data');
      
      setFoodData({
        name: 'Demo Product (Web)',
        calories: '150',
        protein: '5.0',
        carbs: '20.0',
        fat: '8.0',
        serving: '1 serving',
      });
      setShowFoodModal(true);
    } else {
      // Real barcode scanning with Nutritionix API
      fetchNutritionDataByBarcode(data);
    }
  };

  const handleManualEntry = () => {
    console.log('✏️ Manual entry initiated');
    
    setFoodData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      serving: '',
    });
    setShowFoodModal(true);
  };

  const handleSearchFood = () => {
    console.log('🔍 Food search initiated');
    
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchModal(true);
  };

  const handleSaveFood = async () => {
    if (!foodData.name.trim() || !foodData.calories.trim()) {
      Alert.alert('Missing Information', 'Please fill in at least the food name and calories.');
      return;
    }

    const calories = parseInt(foodData.calories);
    if (isNaN(calories) || calories < 0) {
      Alert.alert('Invalid Calories', 'Please enter a valid number for calories.');
      return;
    }

    try {
      console.log('💾 Saving food entry:', foodData);
      
      const foodEntry: FoodEntry = {
        id: Date.now().toString(),
        name: foodData.name.trim(),
        calories: calories,
        protein: parseFloat(foodData.protein) || 0,
        carbs: parseFloat(foodData.carbs) || 0,
        fat: parseFloat(foodData.fat) || 0,
        date: new Date().toISOString(),
      };

      await saveFoodEntry(foodEntry);
      setShowFoodModal(false);
      
      // Reset form
      setFoodData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        serving: '',
      });
      
      console.log('✅ Food entry saved successfully');
      
      Alert.alert(
        'Success!', 
        `${foodEntry.name} has been added to your food log with ${foodEntry.calories} calories.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error saving food entry:', error);
      Alert.alert('Error', 'Failed to save food entry. Please try again.');
    }
  };

  const handleCancelModal = () => {
    setShowFoodModal(false);
    setFoodData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      serving: '',
    });
  };

  const clearDebugLogs = () => {
    setDebugLogs([]);
    // Use setTimeout to avoid potential state update issues
    setTimeout(() => {
      addDebugLog('Debug logs cleared');
    }, 0);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Loader2 size={48} color="#3B82F6" style={{ marginBottom: 16 }} />
          <Text style={styles.loadingTitle}>Fetching Nutrition Data...</Text>
          <Text style={styles.loadingText}>Please wait while we look up the product information</Text>
        </View>
      </View>
    );
  }

  if (isScanning) {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e'],
          }}
        >
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>Position barcode within the frame</Text>
            <Text style={styles.scannerSubtext}>Make sure the barcode is clearly visible</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsScanning(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Food Scanner</Text>
            <Text style={styles.subtitle}>Scan, search, or add foods manually</Text>
          </View>
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => setShowDebugModal(true)}
          >
            <Bug size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={20} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.actionCard, styles.scanCard]}
            onPress={() => setIsScanning(true)}
          >
            <View style={styles.actionIcon}>
              <Camera size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitle}>Scan Barcode</Text>
            <Text style={styles.actionDescription}>
              Point your camera at a product barcode to automatically get nutrition information
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.searchCard]}
            onPress={handleSearchFood}
          >
            <View style={styles.actionIcon}>
              <Search size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitle}>Search Foods</Text>
            <Text style={styles.actionDescription}>
              Search our database of over 800,000 foods and brands
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.manualCard]}
            onPress={handleManualEntry}
          >
            <View style={styles.actionIcon}>
              <Plus size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitle}>Manual Entry</Text>
            <Text style={styles.actionDescription}>
              Add food items manually by entering nutrition information yourself
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.debugSection}>
          <TouchableOpacity style={styles.testButton} onPress={testAPI}>
            <Text style={styles.testButtonText}>Test API Connection</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips for Best Results</Text>
          <View style={styles.tip}>
            <Text style={styles.tipNumber}>1</Text>
            <Text style={styles.tipText}>Use barcode scanning for packaged foods</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipNumber}>2</Text>
            <Text style={styles.tipText}>Search for fresh foods and restaurant items</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipNumber}>3</Text>
            <Text style={styles.tipText}>Ensure good lighting when scanning</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipNumber}>4</Text>
            <Text style={styles.tipText}>Review and adjust serving sizes</Text>
          </View>
        </View>
      </ScrollView>

      {/* Debug Modal */}
      <Modal
        visible={showDebugModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Debug Logs</Text>
            <View style={styles.debugHeaderButtons}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearDebugLogs}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDebugModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.debugContent}>
            {debugLogs.map((log, index) => (
              <Text key={index} style={styles.debugLogText}>
                {log}
              </Text>
            ))}
            {debugLogs.length === 0 && (
              <Text style={styles.noLogsText}>No debug logs yet. Try using the scanner or search features.</Text>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Food Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Foods</Text>
            <TouchableOpacity onPress={() => setShowSearchModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchFoods(text);
                }}
                placeholder="Search for foods..."
                placeholderTextColor="#9CA3AF"
                autoFocus
              />
            </View>
          </View>

          <View style={styles.searchResults}>
            {isSearching ? (
              <View style={styles.searchLoadingContainer}>
                <Loader2 size={24} color="#3B82F6" />
                <Text style={styles.searchLoadingText}>Searching...</Text>
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => `${item.food_name}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.searchResultItem}
                    onPress={() => selectSearchResult(item)}
                  >
                    <View style={styles.searchResultContent}>
                      <Text style={styles.searchResultName}>{item.food_name}</Text>
                      {item.brand_name && (
                        <Text style={styles.searchResultBrand}>{item.brand_name}</Text>
                      )}
                      {item.nf_calories && (
                        <Text style={styles.searchResultCalories}>
                          {Math.round(item.nf_calories)} cal per serving
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  searchQuery.length > 0 ? (
                    <View style={styles.emptySearchContainer}>
                      <Text style={styles.emptySearchText}>
                        No foods found for "{searchQuery}"
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.emptySearchContainer}>
                      <Text style={styles.emptySearchText}>
                        Start typing to search for foods
                      </Text>
                    </View>
                  )
                }
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Food Entry Modal */}
      <Modal
        visible={showFoodModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Food Entry</Text>
            <TouchableOpacity onPress={handleCancelModal}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Food Name *</Text>
              <TextInput
                style={styles.input}
                value={foodData.name}
                onChangeText={(text) => setFoodData({...foodData, name: text})}
                placeholder="Enter food name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {foodData.serving && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Serving Size</Text>
                <Text style={styles.servingText}>{foodData.serving}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Calories *</Text>
              <TextInput
                style={styles.input}
                value={foodData.calories}
                onChangeText={(text) => setFoodData({...foodData, calories: text})}
                placeholder="Enter calories"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <Text style={styles.sectionLabel}>Macronutrients (optional)</Text>
            
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionInput}>
                <Text style={styles.inputLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  value={foodData.protein}
                  onChangeText={(text) => setFoodData({...foodData, protein: text})}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.inputLabel}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  value={foodData.carbs}
                  onChangeText={(text) => setFoodData({...foodData, carbs: text})}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.inputLabel}>Fat (g)</Text>
                <TextInput
                  style={styles.input}
                  value={foodData.fat}
                  onChangeText={(text) => setFoodData({...foodData, fat: text})}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.nutritionSummary}>
              <Text style={styles.summaryTitle}>Nutrition Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Calories:</Text>
                <Text style={styles.summaryValue}>{foodData.calories || '0'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Protein:</Text>
                <Text style={styles.summaryValue}>{foodData.protein || '0'}g</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Carbs:</Text>
                <Text style={styles.summaryValue}>{foodData.carbs || '0'}g</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Fat:</Text>
                <Text style={styles.summaryValue}>{foodData.fat || '0'}g</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelModalButton]}
              onPress={handleCancelModal}
            >
              <Text style={styles.cancelModalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveModalButton]}
              onPress={handleSaveFood}
            >
              <Check size={16} color="#FFFFFF" />
              <Text style={styles.saveModalButtonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  debugButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 200,
    borderWidth: 3,
    borderColor: '#3B82F6',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scannerText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 24,
    textAlign: 'center',
  },
  scannerSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  cancelButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSection: {
    gap: 16,
    marginBottom: 24,
  },
  actionCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scanCard: {
    backgroundColor: '#3B82F6',
  },
  searchCard: {
    backgroundColor: '#8B5CF6',
  },
  manualCard: {
    backgroundColor: '#10B981',
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  debugSection: {
    marginBottom: 24,
  },
  testButton: {
    backgroundColor: '#F97316',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  debugHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  debugContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  debugLogText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginBottom: 8,
    lineHeight: 16,
  },
  noLogsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 32,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  searchResults: {
    flex: 1,
  },
  searchLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  searchLoadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  searchResultItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultContent: {
    gap: 4,
  },
  searchResultName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  searchResultBrand: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  searchResultCalories: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  emptySearchContainer: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
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
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  servingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  nutritionInput: {
    flex: 1,
  },
  nutritionSummary: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
    backgroundColor: '#F3F4F6',
  },
  saveModalButton: {
    backgroundColor: '#3B82F6',
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  saveModalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});