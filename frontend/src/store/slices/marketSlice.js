import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { marketAPI } from '../../services/api'

export const fetchMarketItems = createAsyncThunk(
  'market/fetchItems',
  async (params, { rejectWithValue }) => {
    try {
      const response = await marketAPI.getItems(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch items')
    }
  }
)

export const createMarketItem = createAsyncThunk(
  'market/createItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await marketAPI.createItem(itemData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create item')
    }
  }
)

const marketSlice = createSlice({
  name: 'market',
  initialState: {
    items: [],
    currentItem: null,
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
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchMarketItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMarketItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchMarketItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create item
      .addCase(createMarketItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createMarketItem.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload.data)
      })
      .addCase(createMarketItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentItem } = marketSlice.actions
export default marketSlice.reducer