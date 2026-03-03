const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Institution {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  address: string;
  website: string;
  aishe_code?: string;
  year_of_establishment?: number;
  location_type?: string;
}

/**
 * Fetch all institutions from the backend API
 */
export const fetchInstitutions = async (): Promise<Institution[]> => {
  try {
    // Add cache-busting timestamp for development
    const timestamp = new Date().getTime();
    const url = `${API_BASE_URL}/api/institutions?flat=true&_t=${timestamp}`;
    console.log(`🌐 Fetching institutions from: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Prevent browser caching
    });
    
    if (!response.ok && response.status !== 304) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle 304 Not Modified - return empty array or re-fetch
    if (response.status === 304) {
      console.warn('⚠️ Received 304 Not Modified - forcing fresh fetch');
      // Force a fresh request without cache
      const freshUrl = `${API_BASE_URL}/api/institutions?_t=${Date.now()}`;
      const freshResponse = await fetch(freshUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await freshResponse.json();
      console.log(`✅ Received ${Array.isArray(data) ? data.length : 0} institutions (fresh fetch)`);
      return Array.isArray(data) ? data : [];
    }
    
    const data = await response.json();
    console.log(`✅ Received ${Array.isArray(data) ? data.length : 0} institutions`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Error fetching institutions:', error);
    console.error('API URL was:', API_BASE_URL);
    throw error;
  }
};

/**
 * Fetch a single institution by ID
 */
export const fetchInstitutionById = async (id: string): Promise<Institution> => {
  try {
    const timestamp = new Date().getTime();
    const url = `${API_BASE_URL}/api/institutions/${id}?_t=${timestamp}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Prevent browser caching
    });
    
    if (!response.ok && response.status !== 304) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle 304 Not Modified
    if (response.status === 304) {
      const freshUrl = `${API_BASE_URL}/api/institutions/${id}?_t=${Date.now()}`;
      const freshResponse = await fetch(freshUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return await freshResponse.json();
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching institution:', error);
    throw error;
  }
};

/**
 * Get random N institutions from an array
 */
export const getRandomInstitutions = (institutions: Institution[], count: number): Institution[] => {
  const shuffled = [...institutions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

