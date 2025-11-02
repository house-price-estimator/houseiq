const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);
console.log('All env vars:', import.meta.env);

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PredictRequest {
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  floorArea?: number; // Frontend uses floorArea, backend uses area_sqm
  age_years: number;
  propertyAge?: number; // Frontend uses propertyAge, backend uses age_years
  location_index: number;
  locationIndex?: number; // Frontend uses locationIndex, backend uses location_index
}

export interface Prediction {
  id: string;
  ownerId: string;
  features: Record<string, any>;
  predictedPrice: number;
  modelVersion: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CreatePredictionResponse {
  id: string;
  features: Record<string, any>;
  predicted_price: number;
  model_version: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Helper function to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  headers.set('Content-Type', 'application/json');
  
  return fetch(url, {
    ...options,
    headers,
  });
};

// Auth API
export const authAPI = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorText = await response.text();
          if (errorText) {
            // Try to parse as JSON first
            try {
              const errorJson = JSON.parse(errorText);
              // Backend returns {code: "...", message: "..."}
              errorMessage = errorJson.message || errorJson.code || errorText;
            } catch {
              // If not JSON, use the text directly
              errorMessage = errorText;
            }
          }
        } catch (e) {
          // Failed to parse error response
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAuthToken(data.token);
      return data;
    } catch (error: any) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Registering with data:', userData); // Debug log
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorText = await response.text();
          console.log('Error response:', errorText); // Debug log
          if (errorText) {
            // Try to parse as JSON first
            try {
              const errorJson = JSON.parse(errorText);
              // Backend returns {code: "...", message: "..."}
              errorMessage = errorJson.message || errorJson.code || errorText;
            } catch {
              // If not JSON, use the text directly
              errorMessage = errorText;
            }
          }
        } catch (e) {
          // Failed to parse error response
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAuthToken(data.token);
      return data;
    } catch (error: any) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  logout(): void {
    removeAuthToken();
  },

  getToken(): string | null {
    return getAuthToken();
  },
};

// Prediction API
export const predictionAPI = {
  async createPrediction(request: PredictRequest): Promise<CreatePredictionResponse> {
    // Map frontend field names to backend field names
    const backendRequest = {
      bedrooms: request.bedrooms,
      bathrooms: request.bathrooms,
      area_sqm: request.area_sqm || request.floorArea || 0,
      age_years: request.age_years || request.propertyAge || 0,
      location_index: request.location_index || request.locationIndex || 0,
    };

    const response = await authFetch(`${API_BASE_URL}/predictions`, {
      method: 'POST',
      body: JSON.stringify(backendRequest),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Prediction failed');
    }

    return response.json();
  },

  async getPredictions(page: number = 0, size: number = 20): Promise<Prediction[]> {
    const response = await authFetch(
      `${API_BASE_URL}/predictions?page=${page}&size=${size}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch predictions');
    }

    return response.json();
  },

  async getPrediction(id: string): Promise<Prediction> {
    const response = await authFetch(`${API_BASE_URL}/predictions/${id}`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch prediction');
    }

    return response.json();
  },

  async deletePrediction(id: string): Promise<void> {
    const response = await authFetch(`${API_BASE_URL}/predictions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to delete prediction');
    }
  },
};

// Health check API
export const healthAPI = {
  async check(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  },
};

