import React, { useState } from 'react';
import StockCard from './components/StockCard';
import StockChart from './components/StockChart';

function App() {
  const [symbol, setSymbol] = useState('AAPL');

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stock Prediction Dashboard</h1>
      
      <StockCard onPredict={setSymbol} />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Historical Data & Prediction</h2>
        <StockChart symbol={symbol} />
      </div>
    </div>
  );
}

export default App;
/*import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predict from './pages/Predict';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;  */