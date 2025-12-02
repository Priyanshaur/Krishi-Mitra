import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [
      { id: 1, text: "Welcome to Krishi Mitra!", read: false, time: "Just now" },
      { id: 2, text: "Check out the new market prices.", read: false, time: "2 hours ago" }
    ], // Initial dummy data for testing
    unreadCount: 2
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state) => {
      state.items.forEach(item => item.read = true);
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    }
  }
});

export const { addNotification, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;