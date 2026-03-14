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
