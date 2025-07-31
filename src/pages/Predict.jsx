import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Calendar, DollarSign, RefreshCw, AlertCircle, BarChart3 } from 'lucide-react';
import { getStockData, getPrediction } from '../services/stockService';

function LiveCandlestickChart() {
  const [symbol, setSymbol] = useState('');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(0);
  const [volume, setVolume] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const [predictionConfidence, setPredictionConfidence] = useState(0);
  const [technicalIndicators, setTechnicalIndicators] = useState({});

  const intervalRef = useRef(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'white'
    },
    maxWidth: {
      width: '100%',
      margin: '0'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    subtitle: {
      fontSize: '1rem',
      color: '#94a3b8',
      margin: '0'
    },
    card: {
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    inputSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#e2e8f0'
    },
    input: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.2s',
      width: '100%',
      maxWidth: '500px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    button: {
      padding: '12px 20px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    stopButton: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    disabledButton: {
      opacity: '0.5',
      cursor: 'not-allowed'
    },
    errorCard: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    errorTitle: {
      color: '#ef4444',
      margin: '0 0 4px 0',
      fontSize: '1rem'
    },
    errorText: {
      color: '#fecaca',
      margin: '0',
      fontSize: '0.875rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid rgba(148, 163, 184, 0.1)'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#94a3b8',
      margin: '0 0 4px 0'
    },
    statValue: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: 'white',
      margin: '0'
    },
    positiveValue: {
      color: '#10b981'
    },
    negativeValue: {
      color: '#ef4444'
    },
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '8px'
    },
    liveDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#ef4444',
      animation: 'pulse 1.5s infinite'
    },
    liveText: {
      fontSize: '0.75rem',
      color: '#ef4444'
    },
    predictionSection: {
      marginBottom: '24px'
    },
    predictionCard: {
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      textAlign: 'center'
    },
    predictionTitle: {
      fontSize: '0.875rem',
      color: '#94a3b8',
      margin: '0 0 8px 0'
    },
    predictionValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      margin: '0 0 12px 0',
      padding: '8px',
      borderRadius: '6px'
    },
    buyPrediction: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.3)'
    },
    sellPrediction: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    holdPrediction: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      color: '#f59e0b',
      border: '1px solid rgba(245, 158, 11, 0.3)'
    },
    confidenceBar: {
      height: '6px',
      backgroundColor: 'rgba(148, 163, 184, 0.1)',
      borderRadius: '3px',
      margin: '8px 0',
      overflow: 'hidden'
    },
    confidenceFill: {
      height: '100%',
      borderRadius: '3px'
    },
    confidenceText: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      margin: '0'
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    chartTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: 'white',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px'
    },
    loadingContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    },
    loadingText: {
      color: '#94a3b8',
      margin: '0'
    },
    chartContainer: {
      height: '500px',
      width: '100%'
    },
    emptyState: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px'
    },
    emptyContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      textAlign: 'center',
      maxWidth: '300px'
    },
    emptyTitle: {
      color: '#e2e8f0',
      margin: '0',
      fontSize: '1rem',
      fontWeight: '500'
    },
    emptySubtitle: {
      color: '#94a3b8',
      margin: '0',
      fontSize: '0.875rem'
    },
    footer: {
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: '0.875rem',
      marginTop: '32px'
    }
  };

  const fetchData = async (stockSymbol) => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch both historical data and prediction from your FastAPI backend
      const [historicalData, predictionData] = await Promise.all([
        getStockData(stockSymbol),
        getPrediction(stockSymbol)
      ]);

      // Transform historical data for chart
      const transformedData = historicalData.map((item, index, array) => {
        const prevItem = index > 0 ? array[index - 1] : null;
        const priceChange = prevItem ? ((item.value - prevItem.value) / prevItem.value) * 100 : 0;
        
        return {
          date: new Date(item.time * 1000).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
          }),
          fullDate: new Date(item.time * 1000).toISOString(),
          open: item.value,
          high: item.value * (1 + Math.abs(priceChange)/200), // Simulate high
          low: item.value * (1 - Math.abs(priceChange)/200),  // Simulate low
          close: item.value,
          volume: 1000000 + Math.floor(Math.random() * 1000000) // Simulate volume
        };
      });

      setChartData(transformedData);
      
      // Set current price and stats
      if (transformedData.length > 0) {
        const latest = transformedData[transformedData.length - 1];
        const previous = transformedData[transformedData.length - 2];
        
        setCurrentPrice(latest.close);
        setVolume(latest.volume);
        
        if (previous) {
          setPriceChange(((latest.close - previous.close) / previous.close) * 100);
        }
      }

      // Set prediction data
      if (predictionData.prediction) {
        // Adjust these based on your actual API response structure
        const latestPrediction = predictionData.prediction[0];
        setPrediction(latestPrediction.trend || 'HOLD');
        setPredictionConfidence(latestPrediction.confidence || 50);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('[ERROR] fetchData failed:', err);
      setError(`Failed to fetch data: ${err.message}`);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const startLiveUpdate = (stockSymbol) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsLiveMode(true);
    fetchData(stockSymbol);

    intervalRef.current = setInterval(() => {
      fetchData(stockSymbol);
    }, 30000); // Update every 30 seconds
  };

  const stopLiveUpdate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsLiveMode(false);
  };

  const handlePredict = () => {
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }
    setError('');
    startLiveUpdate(symbol.toUpperCase());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePredict();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const CandlestickBar = (props) => {
  const { payload, x, y, width, height } = props;
  if (!payload) return null;

  // Wider and more prominent candles
  const candleWidth = Math.max(width * 0.7, 4); // 70% of available width
  const wickWidth = 2; // Thicker wicks
  const centerX = x + width / 2;
  
  // Vibrant colors
  const isGreen = payload.close > payload.open;
  const bodyColor = isGreen ? '#10B981' : '#EF4444'; // Green/Red
  const wickColor = isGreen ? '#6EE7B7' : '#FCA5A5'; // Light green/light red
  
  // Calculate positions
  const scale = height / (Math.max(...chartData.map(d => d.high)) - Math.min(...chartData.map(d => d.low)));
  const minPrice = Math.min(...chartData.map(d => d.low));
  
  const highY = y + height - (payload.high - minPrice) * scale;
  const lowY = y + height - (payload.low - minPrice) * scale;
  const openY = y + height - (payload.open - minPrice) * scale;
  const closeY = y + height - (payload.close - minPrice) * scale;
  
  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.abs(openY - closeY);

  return (
    <g>
      {/* Upper wick */}
      <line
        x1={centerX}
        y1={highY}
        x2={centerX}
        y2={bodyTop}
        stroke={wickColor}
        strokeWidth={wickWidth}
      />
      {/* Lower wick */}
      <line
        x1={centerX}
        y1={bodyTop + bodyHeight}
        x2={centerX}
        y2={lowY}
        stroke={wickColor}
        strokeWidth={wickWidth}
      />
      {/* Candle body - now with rounded corners */}
      <rect
        x={centerX - candleWidth / 2}
        y={bodyTop}
        width={candleWidth}
        height={Math.max(bodyHeight, 1)}
        fill={bodyColor}
        rx={2} // Rounded corners
        ry={2}
      />
    </g>
  );
};

// Enhanced tooltip
const CustomCandlestickTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length && payload[0].payload) {
    const data = payload[0].payload;
    const isUp = data.close > data.open;
    
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.95)',
        border: `2px solid ${isUp ? '#10B981' : '#EF4444'}`,
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.25)'
      }}>
        <h3 style={{
          color: 'white',
          borderBottom: '1px solid #334155',
          paddingBottom: '6px',
          marginBottom: '8px'
        }}>
          {symbol} • {label}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <span style={{ color: '#94A3B8' }}>Open:</span>
          <span>${data.open?.toFixed(2)}</span>
          <span style={{ color: '#94A3B8' }}>High:</span>
          <span style={{ color: '#10B981' }}>${data.high?.toFixed(2)}</span>
          <span style={{ color: '#94A3B8' }}>Low:</span>
          <span style={{ color: '#EF4444' }}>${data.low?.toFixed(2)}</span>
          <span style={{ color: '#94A3B8' }}>Close:</span>
          <span style={{ 
            color: isUp ? '#10B981' : '#EF4444',
            fontWeight: 'bold'
          }}>${data.close?.toFixed(2)}</span>
        </div>
        <div style={{
          marginTop: '8px',
          paddingTop: '6px',
          borderTop: '1px solid #334155',
          color: '#94A3B8',
          fontSize: '0.8rem'
        }}>
          Volume: {data.volume?.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin { animation: spin 1s linear infinite; }
        `}
      </style>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <BarChart3 color="#3b82f6" size={40} />
            Live Candlestick Chart
          </h1>
          <p style={styles.subtitle}>Real-time OHLC candlestick patterns</p>
        </div>

        <div style={styles.card}>
          <div style={styles.inputSection}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Stock Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter symbol (e.g., AAPL, GOOGL, TSLA)"
                style={styles.input}
                disabled={loading}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button
                onClick={handlePredict}
                disabled={loading || !symbol.trim()}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  ...(loading || !symbol.trim() ? styles.disabledButton : {})
                }}
              >
                {loading ? (
                  <RefreshCw className="spin" size={20} />
                ) : (
                  <BarChart3 size={20} />
                )}
                {loading ? 'Loading...' : 'Start Live Chart'}
              </button>
              {isLiveMode && (
                <button
                  onClick={stopLiveUpdate}
                  style={{...styles.button, ...styles.stopButton}}
                >
                  Stop Live
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorCard}>
            <AlertCircle color="#ef4444" size={20} />
            <div>
              <h3 style={styles.errorTitle}>Error</h3>
              <p style={styles.errorText}>{error}</p>
            </div>
          </div>
        )}

        {symbol && chartData.length > 0 && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div>
                <p style={styles.statLabel}>Current Price</p>
                <p style={styles.statValue}>
                  ${currentPrice?.toFixed(2)}
                </p>
              </div>
              <DollarSign color="#10b981" size={32} />
            </div>
            
            <div style={styles.statCard}>
              <div>
                <p style={styles.statLabel}>Price Change</p>
                <p style={{
                  ...styles.statValue,
                  ...(priceChange >= 0 ? styles.positiveValue : styles.negativeValue)
                }}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </p>
              </div>
              <TrendingUp color={priceChange >= 0 ? '#10b981' : '#ef4444'} size={32} />
            </div>

            <div style={styles.statCard}>
              <div>
                <p style={styles.statLabel}>Volume</p>
                <p style={styles.statValue}>
                  {volume?.toLocaleString()}
                </p>
              </div>
              <Activity color="#3b82f6" size={32} />
            </div>
            
            <div style={styles.statCard}>
              <div>
                <p style={styles.statLabel}>Last Updated</p>
                <p style={styles.statValue}>
                  {lastUpdated?.toLocaleTimeString()}
                </p>
                {isLiveMode && (
                  <div style={styles.liveIndicator}>
                    <div style={styles.liveDot}></div>
                    <span style={styles.liveText}>LIVE</span>
                  </div>
                )}
              </div>
              <Calendar color="#3b82f6" size={32} />
            </div>
          </div>
        )}

        {symbol && chartData.length > 0 && (
          <div style={styles.predictionSection}>
            <div style={styles.predictionCard}>
              <h3 style={styles.predictionTitle}>AI Prediction</h3>
              <div style={{
                ...styles.predictionValue,
                ...(prediction === 'BUY' ? styles.buyPrediction : 
                    prediction === 'SELL' ? styles.sellPrediction : styles.holdPrediction)
              }}>
                {prediction}
              </div>
              <div style={styles.confidenceBar}>
                <div style={{
                  ...styles.confidenceFill,
                  width: `${predictionConfidence}%`,
                  backgroundColor: prediction === 'BUY' ? '#10b981' : 
                                   prediction === 'SELL' ? '#ef4444' : '#f59e0b'
                }}></div>
              </div>
              <p style={styles.confidenceText}>
                Confidence: {predictionConfidence}%
              </p>
            </div>
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.chartHeader}>
            <h2 style={styles.chartTitle}>
              <BarChart3 color="#3b82f6" />
              {symbol ? `${symbol} Candlestick Chart` : 'Candlestick Chart'}
            </h2>
            {isLiveMode && (
              <div style={styles.liveIndicator}>
                <div style={styles.liveDot}></div>
                <span style={styles.liveText}>Auto-updating every 30s</span>
              </div>
            )}
          </div>
          
          {loading && chartData.length === 0 ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingContent}>
                <RefreshCw className="spin" color="#3b82f6" size={48} />
                <p style={styles.loadingText}>Loading candlestick data...</p>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip 
                    content={<CustomCandlestickTooltip />}
                  />
                  <Bar 
                    dataKey="high" 
                    shape={<CandlestickBar />}
                    fill="transparent"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyContent}>
                <BarChart3 color="#64748b" size={48} />
                <p style={styles.emptyTitle}>Enter a stock symbol to view candlestick chart</p>
                <p style={styles.emptySubtitle}>Popular symbols: AAPL, GOOGL, MSFT, TSLA, AMZN, NVDA</p>
              </div>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <p>Live candlestick patterns with AI-powered trading signals.</p>
          <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
            ⚠️ This is for educational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LiveCandlestickChart;