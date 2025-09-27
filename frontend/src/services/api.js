import axios from 'axios'
import { store } from '../store/store'
import { logout } from '../store/slices/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      store.dispatch(logout())
      window.location.href = '/login'
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
  
  logout: () => 
    api.post('/auth/logout').then(res => res.data),
}

// Market API
export const marketAPI = {
  getItems: (params = {}) => 
    api.get('/market/items', { params }).then(res => res.data),
  
  getItem: (id) => 
    api.get(`/market/items/${id}`).then(res => res.data),
  
  createItem: (itemData) => 
    api.post('/market/items', itemData).then(res => res.data),
  
  updateItem: (id, itemData) => 
    api.put(`/market/items/${id}`, itemData).then(res => res.data),
  
  deleteItem: (id) => 
    api.delete(`/market/items/${id}`).then(res => res.data),
  
  getUserItems: () => 
    api.get('/market/items/my').then(res => res.data),
}

// Diagnosis API
export const diagnosisAPI = {
  diagnose: (formData) => 
    api.post('/diagnose', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
  
  getHistory: (params = {}) => 
    api.get('/diagnose/history', { params }).then(res => res.data),
  
  getDiagnosis: (id) => 
    api.get(`/diagnose/${id}`).then(res => res.data),
}

// Chat API
export const chatAPI = {
  sendMessage: (message) => 
    api.post('/chat', { message }).then(res => res.data),
}

export default api