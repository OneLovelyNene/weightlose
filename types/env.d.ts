declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_NUTRITIONIX_APP_ID: string;
      EXPO_PUBLIC_NUTRITIONIX_API_KEY: string;
    }
  }
}

// Ensure this file is treated as a module
export {};