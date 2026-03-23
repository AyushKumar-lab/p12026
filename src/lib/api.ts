// API utility for frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API request failed')
  }

  return response.json()
}

// Properties API
export const propertiesAPI = {
  getAll: (params?: { city?: string; minPrice?: number; maxPrice?: number; type?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.city) queryParams.set('city', params.city)
    if (params?.minPrice) queryParams.set('minPrice', params.minPrice.toString())
    if (params?.maxPrice) queryParams.set('maxPrice', params.maxPrice.toString())
    if (params?.type) queryParams.set('type', params.type)
    
    return fetchAPI(`/properties?${queryParams.toString()}`)
  },
  
  getById: (id: string) => fetchAPI(`/properties/${id}`),
  
  create: (data: any) => fetchAPI('/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchAPI(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI(`/properties/${id}`, {
    method: 'DELETE',
  }),
}

// Users API
export const usersAPI = {
  getAll: (type?: string) => fetchAPI(`/users${type ? `?type=${type}` : ''}`),
  
  create: (data: any) => fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// Inquiries API
export const inquiriesAPI = {
  getAll: (params?: { seekerId?: string; landlordId?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.seekerId) queryParams.set('seekerId', params.seekerId)
    if (params?.landlordId) queryParams.set('landlordId', params.landlordId)
    
    return fetchAPI(`/inquiries?${queryParams.toString()}`)
  },
  
  create: (data: any) => fetchAPI('/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// Location Intelligence API
export const locationAPI = {
  analyze: (data: { city: string; businessType: string; investment: number; targetCustomers: string[] }) => 
    fetchAPI('/location-intelligence/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Python Backend API (LocIntel Analysis)
const PYTHON_BACKEND_URL = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://localhost:5000';

export interface AnalysisResponse {
  success: boolean;
  score?: number;
  overallScore?: number;
  rating?: string;
  recommendation?: string;
  factors?: Record<string, number>;
  competitors?: {
    count: number;
    top_competitors: Array<{
      name: string;
      lat: number;
      lon: number;
      type: string;
      distance_km: number;
      address?: string;
    }>;
  };
  demographics?: {
    population: number;
    median_income: number;
    country: string;
  };
  walkability?: {
    street_density_km: number;
    intersection_count: number;
    intersection_density: number;
  };
  transit?: {
    transit_stop_count: number;
  };
  recommendations?: string[];
  zones?: Array<{
    id: number;
    rank: number;
    lat: number;
    lng: number;
    score: number;
    color: string;
    reasoning: string;
  }>;
  topPlaces?: Array<{
    id: number;
    rank: number;
    lat: number;
    lng: number;
    score: number;
    color: string;
    reasoning: string;
  }>;
  error?: string;
}

export interface StatsResponse {
  success: boolean;
  stats: {
    locations_analyzed: number;
    businesses_started: number;
    success_rate: number;
    total_analyses: number;
  };
}

/**
 * Analyze a location using the Python backend
 */
export async function analyzeLocationPython(
  address: string,
  businessType: string,
  radiusMeters: number = 1000
): Promise<AnalysisResponse> {
  try {
    const response = await fetch(`${PYTHON_BACKEND_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        business_type: businessType,
        radius_meters: radiusMeters,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Analysis API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get global statistics from Python backend
 */
export async function getPythonStats(): Promise<StatsResponse> {
  try {
    const response = await fetch(`${PYTHON_BACKEND_URL}/stats`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Stats API error:', error);
    return {
      success: false,
      stats: {
        locations_analyzed: 0,
        businesses_started: 0,
        success_rate: 0,
        total_analyses: 0,
      },
    };
  }
}
