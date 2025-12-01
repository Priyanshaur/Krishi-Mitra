import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { diagnosisAPI } from '../../services/api'
import mockApi from '../../services/mockApi'

// Flag to switch between real and mock API
const USE_MOCK_API = false; // Set to true when backend is not available

export const diagnoseDisease = createAsyncThunk(
  'diagnosis/diagnose',
  async (formData, { rejectWithValue }) => {
    try {
      console.log('Diagnosis thunk: Sending request to API');
      let response;
      if (USE_MOCK_API) {
        // Use mock API for testing
        console.log('Diagnosis thunk: Using mock API');
        response = await mockApi.diagnose(formData);
      } else {
        // Use real API
        console.log('Diagnosis thunk: Using real API');
        response = await diagnosisAPI.diagnose(formData);
      }
      console.log('Diagnosis thunk: Received response', response);
      return response;
    } catch (error) {
      console.error('Diagnosis thunk: Error occurred', error);
      return rejectWithValue(error.response?.data?.message || 'Diagnosis failed');
    }
  }
)

export const fetchDiagnosisHistory = createAsyncThunk(
  'diagnosis/fetchHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await diagnosisAPI.getHistory(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
  }
)

const diagnosisSlice = createSlice({
  name: 'diagnosis',
  initialState: {
    currentDiagnosis: null,
    history: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentDiagnosis: (state) => {
      state.currentDiagnosis = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Diagnose disease
      .addCase(diagnoseDisease.pending, (state) => {
        console.log('Diagnosis slice: Pending state');
        state.loading = true
        state.error = null
      })
      .addCase(diagnoseDisease.fulfilled, (state, action) => {
        console.log('Diagnosis slice: Fulfilled state', action.payload);
        state.loading = false
        state.currentDiagnosis = action.payload.data
        // Add to history only if it's not already there
        if (!state.history.some(item => item.id === action.payload.data.id)) {
          state.history.unshift(action.payload.data)
        }
      })
      .addCase(diagnoseDisease.rejected, (state, action) => {
        console.log('Diagnosis slice: Rejected state', action.payload);
        state.loading = false
        state.error = action.payload
      })
      // Fetch history
      .addCase(fetchDiagnosisHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDiagnosisHistory.fulfilled, (state, action) => {
        state.loading = false
        state.history = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchDiagnosisHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearCurrentDiagnosis } = diagnosisSlice.actions
export default diagnosisSlice.reducer