import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import marketReducer from './slices/marketSlice'
import diagnosisReducer from './slices/diagnosisSlice'
import farmerOrderReducer from './slices/farmerOrderSlice'
import buyerOrderReducer from './slices/buyerOrderSlice'
import notificationReducer from './slices/notificationSlice';

// Custom middleware to log actions
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action.type, action.payload);
  const result = next(action);
  console.log('Next state:', store.getState().auth);
  return result;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,
    diagnosis: diagnosisReducer,
    farmerOrders: farmerOrderReducer,
    buyerOrders: buyerOrderReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(loggerMiddleware),
})