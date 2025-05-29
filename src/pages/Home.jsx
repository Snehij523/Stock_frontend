import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight, Eye, Bell, Settings, User } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketData] = useState([
    { symbol: 'AAPL', price: 185.42, change: 2.34, changePercent: 1.28, volume: '52.3M' },
    { symbol: 'GOOGL', price: 142.87, change: -1.56, changePercent: -1.08, volume: '28.7M' },
    { symbol: 'MSFT', price: 378.91, change: 5.67, changePercent: 1.52, volume: '31.2M' },
    { symbol: 'TSLA', price: 248.50, change: -3.21, changePercent: -1.27, volume: '89.4M' },
    { symbol: 'AMZN', price: 156.78, change: 2.89, changePercent: 1.88, volume: '43.8M' },
    { symbol: 'NVDA', price: 891.34, change: 12.45, changePercent: 1.42, volume: '67.1M' }
  ]);

  const [stats] = useState([
    { title: 'Portfolio Value', value: '$847,293', change: '+2.4%', icon: DollarSign, trend: 'up' },
    { title: 'Today\'s Gain/Loss', value: '+$19,847', change: '+2.4%', icon: TrendingUp, trend: 'up' },
    { title: 'Active Positions', value: '24', change: '+3', icon: BarChart3, trend: 'up' },
    { title: 'Market Cap', value: '$2.1T', change: '+1.8%', icon: PieChart, trend: 'up' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>      <div className="relative z-10 w-full">
        {/* Header */}
        <header className="backdrop-blur-md bg-white/5 w-full">
          <div className="w-full px-8 py-4">
            <div className="flex items-center justify-end">              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-300">Market Status</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">OPEN</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-300">Current Time</p>
                  <p className="text-white font-mono text-sm">
                    {currentTime.toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Bell className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Settings className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <User className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Welcome Back, Trader
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Your personalized market insights and portfolio performance
            </p>
            
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
                <Eye className="inline w-5 h-5 mr-2" />
                View Portfolio
              </button>
              <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transform hover:scale-105 transition-all duration-200 backdrop-blur border border-white/20">
                Start Trading
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <stat.icon className={`w-6 h-6 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-1">{stat.title}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Market Overview */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-8 border border-white/20 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Market Overview</h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                  1D
                </button>
                <button className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/20 transition-colors">
                  1W
                </button>
                <button className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/20 transition-colors">
                  1M
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {marketData.map((stock, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer transform hover:scale-105">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold text-lg">{stock.symbol}</h4>
                    <div className={`flex items-center space-x-1 text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{stock.changePercent}%</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">${stock.price}</p>
                  <p className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}${stock.change}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Vol: {stock.volume}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[2000px] mx-auto">
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Quick Trade</h3>
              <p className="text-gray-300 mb-6">Execute trades with advanced tools and real-time data</p>
              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105">
                Open Trading Terminal
              </button>
            </div>
            
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Market Analysis</h3>
              <p className="text-gray-300 mb-6">Access comprehensive market research and insights</p>
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105">
                View Research Reports
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}