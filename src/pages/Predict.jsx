import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Calendar, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';

function Predict() {
  const [symbol, setSymbol] = useState('');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(0);

  const intervalRef = useRef(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1.125rem'
    },
    card: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      marginBottom: '32px'
    },
    inputSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    inputGroup: {
      flexGrow: 1
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '1.125rem',
      outline: 'none',
      transition: 'all 0.2s'
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      fontSize: '1rem'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    primaryButtonHover: {
      backgroundColor: '#2563eb'
    },
    stopButton: {
      backgroundColor: '#dc2626',
      color: 'white'
    },
    stopButtonHover: {
      backgroundColor: '#b91c1c'
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    errorCard: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    errorTitle: {
      fontWeight: '500',
      color: '#991b1b',
      margin: '0 0 4px 0'
    },
    errorText: {
      color: '#b91c1c',
      margin: 0
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    statLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#6b7280',
      margin: 0
    },
    statValue: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#111827',
      margin: '4px 0 0 0'
    },
    positiveValue: {
      color: '#059669'
    },
    negativeValue: {
      color: '#dc2626'
    },
    chartHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px'
    },
    chartTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      margin: 0
    },
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.875rem'
    },
    liveDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    },
    liveText: {
      color: '#059669',
      fontWeight: '500'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '384px'
    },
    loadingContent: {
      textAlign: 'center'
    },
    loadingText: {
      color: '#6b7280',
      fontSize: '1.125rem',
      margin: '16px 0 0 0'
    },
    emptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '384px'
    },
    emptyContent: {
      textAlign: 'center'
    },
    emptyTitle: {
      color: '#6b7280',
      fontSize: '1.125rem',
      margin: '16px 0 8px 0'
    },
    emptySubtitle: {
      color: '#9ca3af',
      fontSize: '0.875rem',
      margin: 0
    },
    footer: {
      textAlign: 'center',
      marginTop: '32px',
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    chartContainer: {
      height: '384px'
    }
  };

  const fetchData = async (stockSymbol) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/predict?symbol=${stockSymbol}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      
      const data = await res.json();

      // Transform the data for the chart
      const transformedData = (data.dates || []).map((date, index) => ({
        date: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: '2-digit'
        }),
        price: parseFloat((data.prices || [])[index]),
        fullDate: date
      }));

      setChartData(transformedData);
      
      // Set current price and calculate change
      if (transformedData.length > 0) {
        const latest = transformedData[transformedData.length - 1];
        const previous = transformedData[transformedData.length - 2];
        setCurrentPrice(latest.price);
        if (previous) {
          setPriceChange(((latest.price - previous.price) / previous.price) * 100);
        }
      }
      
      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch prediction. Please check your connection and try again.');
      setChartData([]);
    }
  };

  const startLiveUpdate = (stockSymbol) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setLoading(true);
    setIsLiveMode(true);
    
    fetchData(stockSymbol).finally(() => setLoading(false));

    intervalRef.current = setInterval(() => {
      fetchData(stockSymbol);
    }, 10000);
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
            {`Date: ${label}`}
          </p>
          <p style={{ color: '#3b82f6', margin: 0 }}>
            {`Price: $${payload[0].value.toFixed(2)}`}
          </p>
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
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            <TrendingUp color="#3b82f6" size={40} />
            Stock Price Predictor
          </h1>
          <p style={styles.subtitle}>Real-time stock price predictions powered by AI</p>
        </div>

        {/* Input Section */}
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
                  <Activity size={20} />
                )}
                {loading ? 'Loading...' : 'Start Prediction'}
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

        {/* Error Message */}
        {error && (
          <div style={styles.errorCard}>
            <AlertCircle color="#dc2626" size={20} />
            <div>
              <h3 style={styles.errorTitle}>Error</h3>
              <p style={styles.errorText}>{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {symbol && chartData.length > 0 && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div>
                <p style={styles.statLabel}>Current Price</p>
                <p style={styles.statValue}>
                  ${currentPrice?.toFixed(2)}
                </p>
              </div>
              <DollarSign color="#059669" size={32} />
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
              <TrendingUp color={priceChange >= 0 ? '#059669' : '#dc2626'} size={32} />
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

        {/* Chart Section */}
        <div style={styles.card}>
          <div style={styles.chartHeader}>
            <h2 style={styles.chartTitle}>
              <Activity color="#3b82f6" />
              {symbol ? `${symbol} Price Prediction` : 'Stock Price Chart'}
            </h2>
            {isLiveMode && (
              <div style={styles.liveIndicator}>
                <div style={styles.liveDot}></div>
                <span style={styles.liveText}>Auto-updating every 10s</span>
              </div>
            )}
          </div>
          
          {loading && chartData.length === 0 ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingContent}>
                <RefreshCw className="spin" color="#3b82f6" size={48} />
                <p style={styles.loadingText}>Loading prediction data...</p>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    name="Predicted Price ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyContent}>
                <Activity color="#9ca3af" size={48} />
                <p style={styles.emptyTitle}>Enter a stock symbol to view predictions</p>
                <p style={styles.emptySubtitle}>Popular symbols: AAPL, GOOGL, MSFT, TSLA, AMZN</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>Predictions are for educational purposes only. Not financial advice.</p>
        </div>
      </div>
    </div>
  );
}

export default Predict;