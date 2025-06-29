# Weight Tracker App

A comprehensive weight and nutrition tracking app built with React Native and Expo.

## Features

- 📊 Weight tracking with progress visualization
- 🍎 Food logging with barcode scanning
- 📈 Analytics and progress charts
- 🎯 Goal setting and tracking
- 🌙 Dark mode support
- 📱 Cross-platform (iOS, Android, Web)

## Building for Android

### Option 1: EAS Build (Recommended)

1. **Install EAS CLI globally:**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to your Expo account:**
   ```bash
   eas login
   ```

3. **Configure your project:**
   ```bash
   eas build:configure
   ```

4. **Build APK for testing:**
   ```bash
   eas build --platform android --profile preview
   ```

5. **Download the APK:**
   - Go to https://expo.dev/accounts/[your-username]/projects/weight-tracker-app/builds
   - Download the APK file once the build completes
   - Transfer to your Android device and install

### Option 2: Local Build (Alternative)

If you prefer to build locally:

1. **Install Android Studio and set up Android SDK**

2. **Export the project:**
   ```bash
   npx expo export --platform android
   ```

3. **Build locally:**
   ```bash
   npx expo run:android --variant release
   ```

### Option 3: Expo Development Build

For development and testing:

1. **Install Expo Go app** from Google Play Store

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Scan the QR code** with Expo Go app

## Environment Variables

Create a `.env` file in the root directory:

```
EXPO_PUBLIC_NUTRITIONIX_APP_ID=your_app_id_here
EXPO_PUBLIC_NUTRITIONIX_API_KEY=your_api_key_here
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** Expo Router
- **Storage:** AsyncStorage
- **Icons:** Lucide React Native
- **Camera:** Expo Camera
- **API:** Nutritionix for food data

## App Structure

- `app/` - Main application screens and navigation
- `components/` - Reusable UI components
- `utils/` - Utility functions and API integrations
- `types/` - TypeScript type definitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details