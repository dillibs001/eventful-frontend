// src/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  // We use <T> to represent the Return Type
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return response.json();
  },

  // GET just needs to know what it returns (R)
  get: <R>(endpoint: string) => 
    api.request<R>(endpoint, { method: 'GET' }),
  
  // POST needs to know what it sends (T) and what it returns (R)
  post: <T, R>(endpoint: string, body: T) => 
    api.request<R>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    
  patch: <T, R>(endpoint: string, body: T) => 
    api.request<R>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    
  delete: <R>(endpoint: string) => 
    api.request<R>(endpoint, { method: 'DELETE' }),
};