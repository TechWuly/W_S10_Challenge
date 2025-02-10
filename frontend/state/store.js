import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Endpoints
const HISTORY_URL = 'http://localhost:9009/api/pizza/history';
const ORDER_URL = 'http://localhost:9009/api/pizza/order';

// Async Thunks
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get(HISTORY_URL);
  return response.data; // API returns an array of orders
});

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, thunkAPI) => {
    try {
      const response = await axios.post(ORDER_URL, orderData);
      return response.data.data; // API wraps the new order in 'data'
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Order Slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload); // Add new order to state
      });
  },
});

// Store Configuration
export const resetStore = () =>
  configureStore({
    reducer: {
      orders: ordersSlice.reducer,
    },
    middleware: (getDefault) => getDefault().concat(),
  });

export const store = resetStore();
