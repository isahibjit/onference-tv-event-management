import { configureStore } from '@reduxjs/toolkit';
import eventReducer from '../features/events/eventSlice';
import { apiSlice } from './apiSlice';

export const store = configureStore({
  reducer: {
    event: eventReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
