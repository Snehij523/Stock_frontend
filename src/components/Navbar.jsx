import { Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 border-b border-white/20 shadow-lg">      <div className="w-full px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="p-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="group-hover:transform group-hover:translate-x-1 transition-all duration-300">
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                StockDash
              </h1>
              <p className="text-sm text-purple-200/80">Professional Trading Platform</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-purple-100 hover:bg-white/10 hover:text-white hover:shadow-lg'
              }`}
            >
              Home
            </Link>
            <Link
              to="/predict"
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/predict') 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-purple-100 hover:bg-white/10 hover:text-white hover:shadow-lg'
              }`}
            >
              Predict
            </Link>
            <Link
              to="/about"
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/about') 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-purple-100 hover:bg-white/10 hover:text-white hover:shadow-lg'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
