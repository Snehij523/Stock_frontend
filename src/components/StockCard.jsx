import React, { useState } from 'react';
import { getPrediction } from '../services/stockService';

function StockCard() {
  const [symbol, setSymbol] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await getPrediction(symbol);
      setPrediction(data.prediction);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <form onSubmit={handlePredict}>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter Stock Symbol (e.g., AAPL)"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-2 bg-blue-600 text-white px-4 py-1 rounded"
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {prediction && (
        <div className="mt-4">
          <h3 className="font-bold">Prediction for {symbol}</h3>
          <ul>
            {prediction.map((item) => (
              <li key={item.ds}>
                {new Date(item.ds).toLocaleDateString()}: ${item.yhat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 font-semibold">
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default StockCard;