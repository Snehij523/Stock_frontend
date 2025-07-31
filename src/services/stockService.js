// src/services/stockService.js
import axios from 'axios';

// 1. Configure API URL (MUST match your FastAPI server)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// 2. Create axios instance with error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Real API Functions (No Mock Data)

/**
 * Fetches REAL historical stock data from FastAPI
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 * @returns {Promise<Array>} - [{ time: UnixTimestamp, value: price }]
 */
export const getStockData = async (symbol) => {
  try {
    const { data } = await api.get(`/historical?symbol=${symbol.toUpperCase()}`);
    
    if (!data?.data) throw new Error('Invalid response format');
    
    return data.data.map(item => ({
      time: Math.floor(new Date(item.date).getTime() / 1000), // Convert to Unix
      value: parseFloat(item.price)
    }));
    
  } catch (error) {
    console.error('Real API Error (historical):', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch real historical data');
  }
};

/**
 * Gets REAL predictions from FastAPI
 * @param {string} symbol 
 * @returns {Promise<{symbol: string, prediction: Array}>}
 */
export const getPrediction = async (symbol) => {
  try {
    const { data } = await api.get(`/predict?symbol=${symbol.toUpperCase()}`);
    
    if (!data?.prediction) throw new Error('Invalid prediction response');
    
    return {
      symbol: data.symbol,
      prediction: data.prediction.map(p => ({
        ds: p.ds,
        yhat: parseFloat(p.yhat) // Ensure number type
      }))
    };
    
  } catch (error) {
    console.error('Real API Error (predict):', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Real prediction failed');
  }
};

// 4. Debugging Interceptors
api.interceptors.request.use(config => {
  console.log('[REAL API REQUEST]', config.url);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('[REAL API RESPONSE]', response.config.url, response.status);
    return response;
  },
  error => {
    console.error('[REAL API ERROR]', error.config?.url, error.response?.status);
    return Promise.reject(error);
  }
);