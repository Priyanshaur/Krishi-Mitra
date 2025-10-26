import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { farmerOrdersAPI } from '../../services/api'

export const fetchFarmerOrders = createAsyncThunk(
  'farmerOrders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await farmerOrdersAPI.getOrders()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
    }
  }
)

export const fetchFarmerOrder = createAsyncThunk(
  'farmerOrders/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await farmerOrdersAPI.getOrder(orderId)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order')
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'farmerOrders/updateStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await farmerOrdersAPI.updateOrderStatus(orderId, status)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status')
    }
  }
)

const farmerOrderSlice = createSlice({
  name: 'farmerOrders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchFarmerOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFarmerOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.data
      })
      .addCase(fetchFarmerOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch order
      .addCase(fetchFarmerOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFarmerOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload.data
      })
      .addCase(fetchFarmerOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        // Update the order in the orders list
        const index = state.orders.findIndex(order => order._id === action.payload.data._id)
        if (index !== -1) {
          state.orders[index] = action.payload.data
        }
        // Update current order if it's the same
        if (state.currentOrder && state.currentOrder._id === action.payload.data._id) {
          state.currentOrder = action.payload.data
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentOrder } = farmerOrderSlice.actions
export default farmerOrderSlice.reducer