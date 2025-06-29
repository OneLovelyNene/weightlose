// Nutritionix API integration with comprehensive error logging
const NUTRITIONIX_APP_ID = process.env.EXPO_PUBLIC_NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.EXPO_PUBLIC_NUTRITIONIX_API_KEY;

export interface NutritionixFood {
  food_name: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
  nf_serving_qty: number;
  nf_serving_unit: string;
  brand_name?: string;
  serving_weight_grams?: number;
}

export interface NutritionixSearchResult {
  foods: NutritionixFood[];
}

export interface NutritionixBarcodeResult {
  foods: NutritionixFood[];
}

class NutritionixAPI {
  private baseURL = 'https://trackapi.nutritionix.com/v2';
  
  private getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'x-app-id': NUTRITIONIX_APP_ID || '',
      'x-app-key': NUTRITIONIX_API_KEY || '',
    };
    
    // Log headers (without exposing full API key)
    console.log('🔑 API Headers Check:', {
      'Content-Type': headers['Content-Type'],
      'x-app-id': headers['x-app-id'] ? `${headers['x-app-id'].substring(0, 8)}...` : '❌ MISSING',
      'x-app-key': headers['x-app-key'] ? `${headers['x-app-key'].substring(0, 8)}...` : '❌ MISSING',
      'app-id-length': headers['x-app-id']?.length || 0,
      'api-key-length': headers['x-app-key']?.length || 0,
    });
    
    return headers;
  }

  private logRequest(method: string, url: string, body?: any) {
    console.log(`📤 ${method} Request to:`, url);
    console.log('📤 Timestamp:', new Date().toISOString());
    if (body) {
      console.log('📤 Request Body:', JSON.stringify(body, null, 2));
    }
  }

  private async logResponse(response: Response, url: string) {
    const responseClone = response.clone();
    let responseText = '';
    
    try {
      responseText = await responseClone.text();
    } catch (e) {
      console.log('❌ Failed to read response text:', e);
      return;
    }
    
    console.log(`📥 Response from ${url}:`);
    console.log(`📥 Status: ${response.status} ${response.statusText}`);
    console.log(`📥 Headers:`, Object.fromEntries(response.headers.entries()));
    
    // Special handling for 401 errors
    if (response.status === 401) {
      console.log('🚨 401 UNAUTHORIZED ERROR DETAILS:');
      console.log('🚨 This usually means:');
      console.log('   1. Missing API credentials');
      console.log('   2. Invalid App ID or API Key');
      console.log('   3. API usage limits exceeded');
      console.log('   4. Incorrect header format');
      
      console.log('🔍 Current credentials check:');
      console.log('   - App ID exists:', !!NUTRITIONIX_APP_ID);
      console.log('   - App ID length:', NUTRITIONIX_APP_ID?.length || 0);
      console.log('   - API Key exists:', !!NUTRITIONIX_API_KEY);
      console.log('   - API Key length:', NUTRITIONIX_API_KEY?.length || 0);
    }
    
    try {
      const responseJson = JSON.parse(responseText);
      console.log(`📥 Response Body:`, JSON.stringify(responseJson, null, 2));
    } catch (e) {
      console.log(`📥 Response Body (raw):`, responseText);
    }
  }

  private validateCredentials(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!NUTRITIONIX_APP_ID) {
      errors.push('EXPO_PUBLIC_NUTRITIONIX_APP_ID is missing from environment variables');
    } else if (NUTRITIONIX_APP_ID.length < 8) {
      errors.push('EXPO_PUBLIC_NUTRITIONIX_APP_ID appears to be too short (should be 8+ characters)');
    }
    
    if (!NUTRITIONIX_API_KEY) {
      errors.push('EXPO_PUBLIC_NUTRITIONIX_API_KEY is missing from environment variables');
    } else if (NUTRITIONIX_API_KEY.length < 32) {
      errors.push('EXPO_PUBLIC_NUTRITIONIX_API_KEY appears to be too short (should be 32+ characters)');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  async searchFood(query: string): Promise<NutritionixFood[]> {
    console.log('🔍 Starting food search for:', query);
    
    const validation = this.validateCredentials();
    if (!validation.valid) {
      console.error('❌ Credential Validation Failed:');
      validation.errors.forEach(error => console.error('   -', error));
      throw new Error(`Nutritionix API credentials invalid: ${validation.errors.join(', ')}`);
    }

    const url = `${this.baseURL}/natural/nutrients`;
    const requestBody = {
      query: query,
      timezone: 'US/Eastern'
    };

    try {
      this.logRequest('POST', url, requestBody);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
      });

      await this.logResponse(response, url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        
        if (response.status === 401) {
          throw new Error(`401 Unauthorized: Invalid API credentials or usage limits exceeded. Check your Nutritionix App ID and API Key.`);
        }
        
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data: NutritionixSearchResult = await response.json();
      console.log('✅ Search successful, found foods:', data.foods?.length || 0);
      return data.foods || [];
    } catch (error) {
      console.error('❌ Nutritionix search error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Network Error: Check your internet connection');
        throw new Error('Network error: Unable to connect to Nutritionix API. Check your internet connection.');
      }
      throw error;
    }
  }

  async searchByBarcode(barcode: string): Promise<NutritionixFood | null> {
    console.log('📱 Starting barcode search for:', barcode);
    
    const validation = this.validateCredentials();
    if (!validation.valid) {
      console.error('❌ Credential Validation Failed:');
      validation.errors.forEach(error => console.error('   -', error));
      throw new Error(`Nutritionix API credentials invalid: ${validation.errors.join(', ')}`);
    }

    const url = `${this.baseURL}/search/item?upc=${barcode}`;

    try {
      this.logRequest('GET', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      await this.logResponse(response, url);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('ℹ️ Product not found in database');
          return null; // Product not found
        }
        
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        
        if (response.status === 401) {
          throw new Error(`401 Unauthorized: Invalid API credentials or usage limits exceeded. Check your Nutritionix App ID and API Key.`);
        }
        
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data: NutritionixBarcodeResult = await response.json();
      const food = data.foods?.[0] || null;
      console.log('✅ Barcode search successful:', food ? 'Product found' : 'No product data');
      return food;
    } catch (error) {
      console.error('❌ Nutritionix barcode search error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Network Error: Check your internet connection');
        throw new Error('Network error: Unable to connect to Nutritionix API. Check your internet connection.');
      }
      throw error;
    }
  }

  async getInstantSearch(query: string): Promise<any[]> {
    console.log('⚡ Starting instant search for:', query);
    
    const validation = this.validateCredentials();
    if (!validation.valid) {
      console.error('❌ Credential Validation Failed:');
      validation.errors.forEach(error => console.error('   -', error));
      throw new Error(`Nutritionix API credentials invalid: ${validation.errors.join(', ')}`);
    }

    const url = `${this.baseURL}/search/instant?query=${encodeURIComponent(query)}`;

    try {
      this.logRequest('GET', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      await this.logResponse(response, url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        
        if (response.status === 401) {
          throw new Error(`401 Unauthorized: Invalid API credentials or usage limits exceeded. Check your Nutritionix App ID and API Key.`);
        }
        
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const results = [...(data.common || []), ...(data.branded || [])];
      console.log('✅ Instant search successful, found results:', results.length);
      return results;
    } catch (error) {
      console.error('❌ Nutritionix instant search error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Network Error: Check your internet connection');
        throw new Error('Network error: Unable to connect to Nutritionix API. Check your internet connection.');
      }
      throw error;
    }
  }
}

export const nutritionixAPI = new NutritionixAPI();

// Helper function to convert Nutritionix food to our FoodEntry format
export const convertNutritionixToFoodData = (food: NutritionixFood) => {
  console.log('🔄 Converting Nutritionix food data:', food);
  
  const displayName = food.brand_name 
    ? `${food.brand_name} ${food.food_name}`
    : food.food_name;

  const converted = {
    name: displayName,
    calories: Math.round(food.nf_calories).toString(),
    protein: food.nf_protein.toFixed(1),
    carbs: food.nf_total_carbohydrate.toFixed(1),
    fat: food.nf_total_fat.toFixed(1),
    serving: `${food.nf_serving_qty} ${food.nf_serving_unit}`,
  };
  
  console.log('✅ Converted food data:', converted);
  return converted;
};

// Debug function to test API connectivity
export const testNutritionixAPI = async () => {
  console.log('🧪 Testing Nutritionix API connectivity...');
  console.log('🔧 Environment Variables Check:');
  console.log('   - EXPO_PUBLIC_NUTRITIONIX_APP_ID:', NUTRITIONIX_APP_ID ? 'SET' : '❌ MISSING');
  console.log('   - EXPO_PUBLIC_NUTRITIONIX_API_KEY:', NUTRITIONIX_API_KEY ? 'SET' : '❌ MISSING');
  
  if (NUTRITIONIX_APP_ID) {
    console.log('   - App ID length:', NUTRITIONIX_APP_ID.length);
    console.log('   - App ID preview:', `${NUTRITIONIX_APP_ID.substring(0, 4)}...`);
  }
  
  if (NUTRITIONIX_API_KEY) {
    console.log('   - API Key length:', NUTRITIONIX_API_KEY.length);
    console.log('   - API Key preview:', `${NUTRITIONIX_API_KEY.substring(0, 8)}...`);
  }
  
  try {
    const results = await nutritionixAPI.getInstantSearch('apple');
    console.log('✅ API Test successful!', results.length, 'results found');
    return true;
  } catch (error) {
    console.error('❌ API Test failed:', error);
    return false;
  }
};