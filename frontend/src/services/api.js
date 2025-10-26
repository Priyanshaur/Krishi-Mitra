import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    // Only redirect to login if we were previously authenticated
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        // Dispatch a logout action to update Redux state
        // The redirect will be handled by the ProtectedRoute component
        window.dispatchEvent(new CustomEvent('unauthorized'));
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (userData) => 
    api.post('/auth/register', userData).then(res => res.data),
  
  getMe: () => 
    api.get('/auth/me').then(res => res.data),
  
  updateProfile: (profileData) => 
    api.put('/auth/profile', profileData).then(res => res.data),
  
  updatePreferences: (preferences) => 
    api.put('/auth/preferences', preferences).then(res => res.data),
  
  logout: () => 
    api.post('/auth/logout').then(res => res.data),
}

// Market API
export const marketAPI = {
  getItems: (params = {}) => 
    api.get('/market/items', { params }).then(res => res.data),
  
  getItem: (id) => {
    console.log('API Service: Getting item with ID:', id);
    return api.get(`/market/items/${id}`).then(res => {
      console.log('API Service: Item response:', res.data);
      return res.data;
    });
  },
  
  createItem: (itemData) => {
    console.log('API: Creating item with data:', itemData);
    return api.post('/market/items', itemData).then(res => {
      console.log('API: Item created successfully:', res.data);
      return res.data;
    }).catch(error => {
      console.error('API: Error creating item:', error);
      console.error('API: Error response:', error.response);
      throw error;
    });
  },

  updateItem: (id, itemData) => 
    api.put(`/market/items/${id}`, itemData).then(res => res.data),
  
  deleteItem: (id) => 
    api.delete(`/market/items/${id}`).then(res => res.data),
  
  getUserItems: () => 
    api.get('/market/items/my').then(res => res.data),
}

// Farmer Orders API
export const farmerOrdersAPI = {
  getOrders: () => 
    api.get('/farmer/orders').then(res => res.data),
  
  getOrder: (id) => 
    api.get(`/farmer/orders/${id}`).then(res => res.data),
  
  updateOrderStatus: (id, status) => 
    api.put(`/farmer/orders/${id}/status`, { status }).then(res => res.data),
}

// Diagnosis API
export const diagnosisAPI = {
  diagnose: (formData) => 
    api.post('/diagnose', formData, {
      headers: { 'Content-Type': 'multipart/form-data' 
    }}).then(res => res.data),
  
  getHistory: (params = {}) => 
    api.get('/diagnose/history', { params }).then(res => res.data),
  
  getDiagnosis: (id) => 
    api.get(`/diagnose/${id}`).then(res => res.data),
}

// Dashboard API
export const dashboardAPI = {
  getFarmerStats: () => 
    api.get('/dashboard/farmer/stats').then(res => res.data),
  
  getBuyerStats: () => 
    api.get('/dashboard/buyer/stats').then(res => res.data),
  
  getRecentActivity: () => 
    api.get('/dashboard/activity').then(res => res.data),
  
  getCropHealth: () => 
    api.get('/dashboard/crop-health').then(res => res.data),
  
  getRecommendedFarmers: () => 
    api.get('/dashboard/recommended-farmers').then(res => res.data),
}

export default api