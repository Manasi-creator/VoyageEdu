const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface AisheVerificationResponse {
  verified: boolean;
  aisheCode?: string;
  name?: string;
  state?: string;
  district?: string;
  location?: string;
  yearOfEstablishment?: number | null;
  error?: string;
}

export const verifyAisheCode = async (code: string): Promise<AisheVerificationResponse> => {
  const endpoint = `${API_BASE_URL}/api/aishe/verify/${encodeURIComponent(code)}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Unable to verify AISHE code at the moment.');
  }

  return response.json();
};
