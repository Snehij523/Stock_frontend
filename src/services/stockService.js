import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Configure axios with debug logging
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,  // Increased timeout for debugging
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false // Disable credentials for CORS
});

// Add request/response logging
api.interceptors.request.use(request => {
  console.log('[API Request]:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    params: request.params,
    data: request.data
  });
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('[API Response]:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('[API Error]:', {
      url: error.config?.url,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
);

// Get historical stock data
export const getStockData = async (symbol) => {
  console.log(`[getStockData] Fetching data for ${symbol}...`);
  try {
    const response = await api.get(`/historical?symbol=${symbol}`);
    const transformed = response.data.data.map(item => ({
      time: Math.floor(new Date(item.date).getTime() / 1000),
      value: parseFloat(item.price)
    }));
    console.log(`[getStockData] Transformed data:`, transformed);
    return transformed;
  } catch (error) {
    console.error(`[getStockData] Error:`, error);
    throw error;
  }
};

// Get stock price prediction
export const getPrediction = async (symbol) => {
  console.log(`[getPrediction] Fetching prediction for ${symbol}...`);
  try {
    const response = await api.get(`/predict?symbol=${symbol}`);
    console.log(`[getPrediction] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[getPrediction] Error:`, error);
    throw error;
  }
};

// Subscribe to real-time updates
export const subscribeToStockUpdates = (symbol, callback) => {
  console.log(`[subscribeToStockUpdates] Starting updates for ${symbol}`);
  let lastUpdate = Date.now();
  
  const interval = setInterval(async () => {
    try {
      // Only fetch if it's been more than 4.5 seconds since last update
      if (Date.now() - lastUpdate >= 4500) {
        const data = await getStockData(symbol);
        if (data.length > 0) {
          lastUpdate = Date.now();
          callback(data[data.length - 1]);
        }
      }
    } catch (error) {
      console.error(`[subscribeToStockUpdates] Error:`, error);
    }
  }, 5000);

  return () => {
    console.log(`[subscribeToStockUpdates] Stopping updates for ${symbol}`);
    clearInterval(interval);
  };
};