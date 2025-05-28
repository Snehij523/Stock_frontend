import axios from 'axios';

// Keep track of last prices to make updates more realistic
const lastPrices = {
  AAPL: 185.42,
  GOOGL: 142.87,
  MSFT: 378.91,
  TSLA: 248.50,
  AMZN: 156.78,
  NVDA: 891.34
};

// Simulate real-time data for development
const generateMockData = (symbol, numPoints = 100) => {
  const data = [];
  const now = new Date();
  let currentPrice = lastPrices[symbol] || 100;
  
  for (let i = 0; i < numPoints; i++) {
    const time = new Date(now.getTime() - (numPoints - i) * 60000); // One minute intervals
    // More realistic price movement (0.1% max change)
    const randomChange = currentPrice * (Math.random() - 0.5) * 0.002;
    currentPrice += randomChange;
    
    data.push({
      time: Math.floor(time.getTime() / 1000), // Unix timestamp in seconds
      value: currentPrice
    });
  }
  
  // Update the last price
  lastPrices[symbol] = currentPrice;
  return data;
};

// Get historical stock data
export const getStockData = async (symbol) => {
  try {
    // TODO: Replace with actual API call
    // For now, return mock data
    const data = generateMockData(symbol);
    return data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
};

// Get real-time stock updates
export const subscribeToStockUpdates = (symbol, callback) => {
  let currentPrice = lastPrices[symbol];
  
  // Simulate real-time updates every 2 seconds
  const interval = setInterval(() => {
    // Generate a small random price movement (0.1% max change)
    const randomChange = currentPrice * (Math.random() - 0.5) * 0.002;
    currentPrice += randomChange;
    
    // Update last price
    lastPrices[symbol] = currentPrice;
    
    const now = new Date();
    const newPoint = {
      time: Math.floor(now.getTime() / 1000), // Unix timestamp in seconds
      value: currentPrice
    };
    
    callback(newPoint);
  }, 2000);

  // Return cleanup function
  return () => clearInterval(interval);
};