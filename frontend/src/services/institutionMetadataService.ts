const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface InstitutionMetadata {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  district?: string;
  address: string;
  website: string;
  aishe_code?: string;
  year_of_establishment?: number;
  location_type?: string;
  description?: string;
  image?: string;
  type?: string;
}

/**
 * Fetch institutions with website metadata from backend
 */
export const fetchInstitutionsWithMetadata = async (): Promise<InstitutionMetadata[]> => {
  try {
    const timestamp = new Date().getTime();
    const url = `${API_BASE_URL}/api/institutions/with-metadata?_t=${timestamp}`;
    console.log(`🌐 Fetching institutions with metadata from: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok && response.status !== 304) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    if (response.status === 304) {
      const freshUrl = `${API_BASE_URL}/api/institutions/with-metadata?_t=${Date.now()}`;
      const freshResponse = await fetch(freshUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await freshResponse.json();
      console.log(`✅ Received ${Array.isArray(data) ? data.length : 0} institutions with metadata (fresh fetch)`);
      return Array.isArray(data) ? data : [];
    }
    
    const data = await response.json();
    console.log(`✅ Received ${Array.isArray(data) ? data.length : 0} institutions with metadata`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Error fetching institutions with metadata:', error);
    console.error('API URL was:', API_BASE_URL);
    throw error;
  }
};

/**
 * Deduplicate institutions based on name and website
 */
export const deduplicateInstitutions = (institutions: InstitutionMetadata[]): InstitutionMetadata[] => {
  const seen = new Map<string, InstitutionMetadata>();
  
  institutions.forEach((inst) => {
    // Create a unique key from name (normalized) and website
    const normalizedName = inst.name.toLowerCase().trim();
    const key = `${normalizedName}|${inst.website || ''}`;
    
    if (!seen.has(key)) {
      seen.set(key, inst);
    } else {
      // Merge data if duplicate found (prioritize non-empty fields)
      const existing = seen.get(key)!;
      const merged: InstitutionMetadata = {
        ...existing,
        // Keep existing non-empty values, but update with new non-empty values
        description: existing.description || inst.description || '',
        image: existing.image || inst.image || '',
        website: existing.website || inst.website || '',
        city: existing.city || inst.city || '',
        state: existing.state || inst.state || '',
        year_of_establishment: existing.year_of_establishment || inst.year_of_establishment || null,
      };
      seen.set(key, merged);
    }
  });
  
  return Array.from(seen.values());
};

