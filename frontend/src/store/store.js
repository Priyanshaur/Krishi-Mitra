import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import marketReducer from './slices/marketSlice'
import diagnosisReducer from './slices/diagnosisSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,
    diagnosis: diagnosisReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})