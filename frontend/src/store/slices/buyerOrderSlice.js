import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { buyerOrdersAPI } from '../../services/api'

export const fetchBuyerOrders = createAsyncThunk(
    'buyerOrders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await buyerOrdersAPI.getMyOrders()
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
        }
    }
)

export const createOrder = createAsyncThunk(
    'buyerOrders/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await buyerOrdersAPI.createOrder(orderData)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order')
        }
    }
)

const buyerOrderSlice = createSlice({
    name: 'buyerOrders',
    initialState: {
        orders: [],
        currentOrder: null,
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearSuccess: (state) => {
            state.success = false
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch orders
            .addCase(fetchBuyerOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBuyerOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload.data
            })
            .addCase(fetchBuyerOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.orders.unshift(action.payload.data)
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.success = false
            })
    }
})

export const { clearError, clearSuccess, setCurrentOrder } = buyerOrderSlice.actions
export default buyerOrderSlice.reducer
