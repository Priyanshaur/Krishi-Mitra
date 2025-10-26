import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { marketAPI } from '../../services/api'

export const fetchMarketItems = createAsyncThunk(
  'market/fetchItems',
  async (params, { rejectWithValue }) => {
    try {
      const response = await marketAPI.getItems(params)
      return response
    } catch (error) {
      console.error('Error fetching market items:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch items')
    }
  }
)

export const fetchUserMarketItems = createAsyncThunk(
  'market/fetchUserItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await marketAPI.getUserItems()
      return response
    } catch (error) {
      console.error('Error fetching user market items:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user items')
    }
  }
)

export const fetchMarketItem = createAsyncThunk(
  'market/fetchItem',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Redux: Fetching market item with ID:', id)
      const response = await marketAPI.getItem(id)
      console.log('Redux: Market item response:', response)
      return response
    } catch (error) {
      console.error('Redux: Error fetching market item:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch item')
    }
  }
)

export const createMarketItem = createAsyncThunk(
  'market/createItem',
  async (itemData, { rejectWithValue }) => {
    try {
      console.log('Creating market item with data:', itemData);
      const response = await marketAPI.createItem(itemData);
      console.log('Market item created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating market item:', error);
      console.error('Error response:', error.response);
      return rejectWithValue(error.response?.data?.message || 'Failed to create item');
    }
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState: {
    items: [],
    userItems: [],
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
      // Fetch user items
      .addCase(fetchUserMarketItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserMarketItems.fulfilled, (state, action) => {
        state.loading = false
        state.userItems = action.payload.data
      })
      .addCase(fetchUserMarketItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch single item
      .addCase(fetchMarketItem.pending, (state) => {
        console.log('Redux: fetchMarketItem pending')
        state.loading = true
        state.error = null
      })
      .addCase(fetchMarketItem.fulfilled, (state, action) => {
        console.log('Redux: fetchMarketItem fulfilled with data:', action.payload.data)
        state.loading = false
        state.currentItem = action.payload.data
        state.error = null
      })
      .addCase(fetchMarketItem.rejected, (state, action) => {
        console.log('Redux: fetchMarketItem rejected with error:', action.payload)
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
        // Also add to user items
        state.userItems.unshift(action.payload.data)
      })
      .addCase(createMarketItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentItem } = marketSlice.actions
export default marketSlice.reducer