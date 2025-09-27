import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { diagnosisAPI } from '../../services/api'

export const diagnoseDisease = createAsyncThunk(
  'diagnosis/diagnose',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await diagnosisAPI.diagnose(formData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Diagnosis failed')
    }
  }
)

export const fetchDiagnosisHistory = createAsyncThunk(
  'diagnosis/fetchHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await diagnosisAPI.getHistory(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history')
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
        state.loading = true
        state.error = null
      })
      .addCase(diagnoseDisease.fulfilled, (state, action) => {
        state.loading = false
        state.currentDiagnosis = action.payload.data
        state.history.unshift(action.payload.data)
      })
      .addCase(diagnoseDisease.rejected, (state, action) => {
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