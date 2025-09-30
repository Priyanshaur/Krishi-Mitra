import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock async login (replace with real API)
export const login = createAsyncThunk('auth/login', async (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'mock-token',
        user: {
          id: '1',
          name: 'Test User',
          email: credentials.email,
          role: 'farmer', // or buyer depending on login
        },
      })
    }, 1000)
  })
})

// Load saved auth but DON'T auto-authenticate
const storedAuth = localStorage.getItem('auth')
const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: parsedAuth?.user || null,
    token: parsedAuth?.token || null,
    isAuthenticated: false,   // ✅ Start as false!
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('auth')
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    clearError: (state) => {
      state.error = null
    },
    // Optional: use this if you want to re-auth after validating token
    rehydrateAuth: (state) => {
      if (parsedAuth?.user && parsedAuth?.token) {
        state.user = parsedAuth.user
        state.token = parsedAuth.token
        state.isAuthenticated = true
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true   // ✅ Only set true after login
        localStorage.setItem(
          'auth',
          JSON.stringify({
            user: action.payload.user,
            token: action.payload.token,
          })
        )
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { logout, clearError, rehydrateAuth } = authSlice.actions
export default authSlice.reducer
