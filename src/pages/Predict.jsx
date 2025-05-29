import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { TrendingUp, Activity, Calendar, DollarSign, RefreshCw, AlertCircle, BarChart3 } from 'lucide-react';

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
    },    maxWidth: {
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
      color: '#94a3b8',
      fontSize: '1.125rem'
    },
    card: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
      color: '#e2e8f0',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      borderRadius: '8px',
      fontSize: '1.125rem',
      outline: 'none',
      transition: 'all 0.2s',
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      color: 'white'
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
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      '&:hover:not(:disabled)': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.3)'
      }
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    stopButton: {
      backgroundColor: '#dc2626',
      color: 'white'
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    errorCard: {
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
      border: '1px solid rgba(220, 38, 38, 0.3)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    errorTitle: {
      fontWeight: '500',
      color: '#fca5a5',
      margin: '0 0 4px 0'
    },
    errorText: {
      color: '#f87171',
      margin: 0
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        border: '1px solid rgba(148, 163, 184, 0.4)',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.3)'
      }
    },
    statLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#94a3b8',
      margin: 0
    },
    statValue: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: 'white',
      margin: '4px 0 0 0'
    },
    positiveValue: {
      color: '#10b981'
    },
    negativeValue: {
      color: '#ef4444'
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
      color: 'white',
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
      color: '#10b981',
      fontWeight: '500'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '500px'
    },
    loadingContent: {
      textAlign: 'center'
    },
    loadingText: {
      color: '#94a3b8',
      fontSize: '1.125rem',
      margin: '16px 0 0 0'
    },
    emptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '500px'
    },
    emptyContent: {
      textAlign: 'center'
    },
    emptyTitle: {
      color: '#94a3b8',
      fontSize: '1.125rem',
      margin: '16px 0 8px 0'
    },
    emptySubtitle: {
      color: '#64748b',
      fontSize: '0.875rem',
      margin: 0
    },
    footer: {
      textAlign: 'center',
      marginTop: '32px',
      color: '#94a3b8',
      fontSize: '0.875rem'
    },
    chartContainer: {
      height: '500px'
    },
    predictionSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    predictionCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        border: '1px solid rgba(148, 163, 184, 0.4)',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.3)'
      }
    },
    predictionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '16px',
      margin: 0
    },
    predictionValue: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    buyPrediction: {
      color: '#10b981'
    },
    sellPrediction: {
      color: '#ef4444'
    },
    holdPrediction: {
      color: '#f59e0b'
    },
    confidenceBar: {
      width: '100%',
      height: '8px',
      backgroundColor: 'rgba(148, 163, 184, 0.2)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '8px'
    },
    confidenceFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.5s ease'
    },
    confidenceText: {
      fontSize: '0.875rem',
      color: '#94a3b8',
      margin: 0
    },
    indicatorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px'
    },
    indicatorItem: {
      textAlign: 'center'
    },
    indicatorLabel: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    indicatorValue: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: 'white'
    },
    bullishIndicator: {
      color: '#10b981'
    },
    bearishIndicator: {
      color: '#ef4444'
    },
    neutralIndicator: {
      color: '#f59e0b'
    }
  };

  // Calculate technical indicators and prediction
  const calculateTechnicalAnalysis = (data) => {
    if (data.length < 20) return { prediction: 'HOLD', confidence: 50, indicators: {} };

    const closes = data.map(d => d.close);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const volumes = data.map(d => d.volume);

    // Simple Moving Average (SMA)
    const sma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const sma50 = closes.length >= 50 ? closes.slice(-50).reduce((a, b) => a + b, 0) / 50 : sma20;

    // Relative Strength Index (RSI)
    const calculateRSI = (prices, period = 14) => {
      if (prices.length < period + 1) return 50;
      
      let gains = 0, losses = 0;
      for (let i = prices.length - period; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains += change;
        else losses -= change;
      }
      
      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgGain / (avgLoss || 1);
      return 100 - (100 / (1 + rs));
    };

    // MACD (simplified)
    const ema12 = closes.slice(-12).reduce((a, b) => a + b, 0) / 12;
    const ema26 = closes.slice(-26).reduce((a, b) => a + b, 0) / 26;
    const macd = ema12 - ema26;

    // Bollinger Bands
    const sma = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const variance = closes.slice(-20).reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / 20;
    const stdDev = Math.sqrt(variance);
    const upperBand = sma + (2 * stdDev);
    const lowerBand = sma - (2 * stdDev);

    const currentPrice = closes[closes.length - 1];
    const rsi = calculateRSI(closes);

    // Volume analysis
    const avgVolume = volumes.slice(-10).reduce((a, b) => a + b, 0) / 10;
    const volumeRatio = volumes[volumes.length - 1] / avgVolume;

    // Price momentum
    const momentum = ((currentPrice - closes[closes.length - 5]) / closes[closes.length - 5]) * 100;

    // Prediction logic
    let bullishSignals = 0;
    let bearishSignals = 0;

    // SMA signals
    if (currentPrice > sma20) bullishSignals++;
    else bearishSignals++;

    if (sma20 > sma50) bullishSignals++;
    else bearishSignals++;

    // RSI signals
    if (rsi < 30) bullishSignals += 2; // Oversold - potential buy
    else if (rsi > 70) bearishSignals += 2; // Overbought - potential sell
    else if (rsi > 50) bullishSignals++;
    else bearishSignals++;

    // MACD signals
    if (macd > 0) bullishSignals++;
    else bearishSignals++;

    // Bollinger Bands signals
    if (currentPrice < lowerBand) bullishSignals += 2; // Oversold
    else if (currentPrice > upperBand) bearishSignals += 2; // Overbought

    // Volume confirmation
    if (volumeRatio > 1.5) {
      if (momentum > 0) bullishSignals++;
      else bearishSignals++;
    }

    // Momentum signals
    if (momentum > 2) bullishSignals++;
    else if (momentum < -2) bearishSignals++;

    // Determine prediction
    const totalSignals = bullishSignals + bearishSignals;
    const bullishPercentage = (bullishSignals / totalSignals) * 100;

    let prediction, confidence;
    if (bullishPercentage > 65) {
      prediction = 'BUY';
      confidence = Math.min(bullishPercentage, 95);
    } else if (bullishPercentage < 35) {
      prediction = 'SELL';
      confidence = Math.min(100 - bullishPercentage, 95);
    } else {
      prediction = 'HOLD';
      confidence = 100 - Math.abs(50 - bullishPercentage);
    }

    const indicators = {
      sma20: sma20.toFixed(2),
      sma50: sma50.toFixed(2),
      rsi: rsi.toFixed(1),
      macd: macd.toFixed(2),
      upperBand: upperBand.toFixed(2),
      lowerBand: lowerBand.toFixed(2),
      momentum: momentum.toFixed(1),
      volumeRatio: volumeRatio.toFixed(1)
    };

    return { prediction, confidence: Math.round(confidence), indicators };
  };

  // Generate realistic OHLC data (simulate real market data)
  const generateOHLCData = (basePrice, days = 30) => {
    const data = [];
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic price movements
      const volatility = 0.03; // 3% daily volatility
      const trend = (Math.random() - 0.5) * 0.02; // Small trend component
      const priceChange = (Math.random() - 0.5) * volatility + trend;
      
      const open = currentPrice;
      const close = open * (1 + priceChange);
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      const volume = Math.floor(Math.random() * 10000000) + 1000000;
      
      data.push({
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        }),
        fullDate: date.toISOString(),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: volume,
        // Calculate body height and position for candlestick
        bodyHeight: Math.abs(close - open),
        bodyBottom: Math.min(open, close),
        isGreen: close > open,
        // Wick data
        upperWick: high - Math.max(open, close),
        lowerWick: Math.min(open, close) - low
      });
      
      currentPrice = close;
    }
    
    return data.reverse(); // Most recent first
  };

  const fetchData = async (stockSymbol) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate base price based on symbol (simulate different stocks)
      const basePrices = {
        'AAPL': 175,
        'GOOGL': 140,
        'MSFT': 375,
        'TSLA': 240,
        'AMZN': 145,
        'NVDA': 450,
        'META': 320,
        'NFLX': 450
      };
      
      const basePrice = basePrices[stockSymbol] || 100 + Math.random() * 200;
      const ohlcData = generateOHLCData(basePrice);
      
      console.log('[DEBUG] Generated OHLC data:', ohlcData);
      
      setChartData(ohlcData);
      
      // Calculate technical analysis and prediction
      const analysis = calculateTechnicalAnalysis(ohlcData);
      setPrediction(analysis.prediction);
      setPredictionConfidence(analysis.confidence);
      setTechnicalIndicators(analysis.indicators);
      
      // Update current price and stats
      if (ohlcData.length > 0) {
        const latest = ohlcData[ohlcData.length - 1];
        const previous = ohlcData[ohlcData.length - 2];
        
        setCurrentPrice(latest.close);
        setVolume(latest.volume);
        
        if (previous) {
          setPriceChange(((latest.close - previous.close) / previous.close) * 100);
        }
      }
      
      setLastUpdated(new Date());
      setError('');
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
    }, 5000); // Update every 5 seconds
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

  // Custom Candlestick Component
  const CandlestickBar = (props) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;

    const candleWidth = Math.max(width * 0.6, 2);
    const wickWidth = 1;
    const centerX = x + width / 2;
    
    const isGreen = payload.close > payload.open;
    const bodyColor = isGreen ? '#10b981' : '#ef4444';
    const wickColor = isGreen ? '#10b981' : '#ef4444';
    
    // Calculate positions based on chart scale
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
        {/* Body */}
        <rect
          x={centerX - candleWidth / 2}
          y={bodyTop}
          width={candleWidth}
          height={Math.max(bodyHeight, 1)}
          fill={isGreen ? bodyColor : 'transparent'}
          stroke={bodyColor}
          strokeWidth={isGreen ? 0 : 1}
        />
      </g>
    );
  };

  const CustomCandlestickTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0].payload) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          padding: '16px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          color: 'white'
        }}>
          <p style={{ fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
            {`${symbol} - ${label}`}
          </p>
          <p style={{ color: '#10b981', margin: '2px 0', fontSize: '0.875rem' }}>
            {`Open: $${data.open?.toFixed(2)}`}
          </p>
          <p style={{ color: '#ef4444', margin: '2px 0', fontSize: '0.875rem' }}>
            {`High: $${data.high?.toFixed(2)}`}
          </p>
          <p style={{ color: '#3b82f6', margin: '2px 0', fontSize: '0.875rem' }}>
            {`Low: $${data.low?.toFixed(2)}`}
          </p>
          <p style={{ color: data.close > data.open ? '#10b981' : '#ef4444', margin: '2px 0', fontSize: '0.875rem' }}>
            {`Close: $${data.close?.toFixed(2)}`}
          </p>
          <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.75rem' }}>
            {`Volume: ${data.volume?.toLocaleString()}`}
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
            <BarChart3 color="#3b82f6" size={40} />
            Live Candlestick Chart
          </h1>
          <p style={styles.subtitle}>Real-time OHLC candlestick patterns</p>
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

        {/* Error Message */}
        {error && (
          <div style={styles.errorCard}>
            <AlertCircle color="#ef4444" size={20} />
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

        {/* Prediction Section */}
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

            <div style={styles.predictionCard}>
              <h3 style={styles.predictionTitle}>Technical Indicators</h3>
              <div style={styles.indicatorGrid}>
                <div style={styles.indicatorItem}>
                  <div style={styles.indicatorLabel}>RSI</div>
                  <div style={{
                    ...styles.indicatorValue,
                    ...(technicalIndicators.rsi > 70 ? styles.bearishIndicator :
                        technicalIndicators.rsi < 30 ? styles.bullishIndicator : styles.neutralIndicator)
                  }}>
                    {technicalIndicators.rsi}
                  </div>
                </div>
                <div style={styles.indicatorItem}>
                  <div style={styles.indicatorLabel}>SMA 20</div>
                  <div style={{
                    ...styles.indicatorValue,
                    ...(currentPrice > technicalIndicators.sma20 ? styles.bullishIndicator : styles.bearishIndicator)
                  }}>
                    ${technicalIndicators.sma20}
                  </div>
                </div>
                <div style={styles.indicatorItem}>
                  <div style={styles.indicatorLabel}>MACD</div>
                  <div style={{
                    ...styles.indicatorValue,
                    ...(technicalIndicators.macd > 0 ? styles.bullishIndicator : styles.bearishIndicator)
                  }}>
                    {technicalIndicators.macd}
                  </div>
                </div>
                <div style={styles.indicatorItem}>
                  <div style={styles.indicatorLabel}>Momentum</div>
                  <div style={{
                    ...styles.indicatorValue,
                    ...(technicalIndicators.momentum > 0 ? styles.bullishIndicator : styles.bearishIndicator)
                  }}>
                    {technicalIndicators.momentum}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart Section */}
        <div style={styles.card}>
          <div style={styles.chartHeader}>
            <h2 style={styles.chartTitle}>
              <BarChart3 color="#3b82f6" />
              {symbol ? `${symbol} Candlestick Chart` : 'Candlestick Chart'}
            </h2>
            {isLiveMode && (
              <div style={styles.liveIndicator}>
                <div style={styles.liveDot}></div>
                <span style={styles.liveText}>Auto-updating every 5s</span>
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

        {/* Footer */}
        <div style={styles.footer}>
          <p>Live candlestick patterns with AI-powered trading signals. Technical analysis includes RSI, SMA, MACD, and momentum indicators.</p>
          <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
            ⚠️ This is for educational purposes only. Not financial advice. Always do your own research before trading.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LiveCandlestickChart;