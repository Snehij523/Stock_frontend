import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:8000/test');
        console.log('Test response:', response.data);
        setStatus(response.data.message);
        setError(null);
      } catch (err) {
        console.error('Connection test failed:', err);
        setError(err.message);
        setStatus('Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="fixed top-4 right-4 p-4 rounded-lg shadow-lg" style={{
      backgroundColor: error ? '#fee2e2' : '#dcfce7',
      color: error ? '#dc2626' : '#16a34a',
    }}>
      <p className="font-medium">Status: {status}</p>
      {error && <p className="text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TestConnection;
