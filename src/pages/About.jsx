import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Shield, Users, Activity, Star, Award, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import "../App.css";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning algorithms analyze market patterns and provide accurate trend predictions for better investment decisions."
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Live market data with interactive charts, technical indicators, and comprehensive analysis tools at your fingertips."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption, secure API connections, and multi-factor authentication to keep your investments safe."
    }
  ];

  const stats = [
    { number: "10M+", label: "Active Users", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Activity },
    { number: "4.9★", label: "User Rating", icon: Star },
    { number: "50+", label: "Markets", icon: Award }
  ];

  const benefits = [
    "Real-time market data from 50+ global exchanges",
    "Advanced technical analysis with 100+ indicators",
    "AI-powered trade recommendations and alerts",
    "Portfolio tracking and risk management tools",
    "Mobile and desktop synchronized experience",
    "24/7 customer support and educational resources"
  ];

  const techStack = [
    { name: "React 18", desc: "Modern UI Framework" },
    { name: "Vite", desc: "Lightning Fast Build" },
    { name: "DaisyUI", desc: "Beautiful Components" },
    { name: "TailwindCSS", desc: "Utility-First Styling" }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="w-full min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center w-full px-8">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full text-purple-200">
              <Zap className="w-4 h-4" />
              <span>Next-Generation Trading Platform</span>
            </div>
          </div>

          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            StockDash
          </h1>
          
          <h2 className="text-4xl font-semibold mb-6 text-white">
            Professional Trading Suite
          </h2>

          <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto">
            Revolutionizing stock market analysis with cutting-edge AI technology, 
            real-time data visualization, and predictive analytics that empower 
            traders to make informed investment decisions.
          </p>

          <div className="flex gap-6 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-bold text-lg hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-lg font-bold text-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-200">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <div className="w-full py-20 bg-gradient-to-b from-transparent to-indigo-950">
        <div className="w-full px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">
              Powerful Features for Modern Trading
            </h3>
            <p className="text-purple-200 text-lg">
              Everything you need to analyze, predict, and execute trades with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[2000px] mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{feature.title}</h4>
                <p className="text-purple-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="w-full py-20">
        <div className="w-full px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[2000px] mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Why Choose StockDash?
              </h2>
              <p className="text-purple-200 mb-8">
                Built with modern technologies and designed for performance, our platform delivers 
                exceptional user experience and reliable trading tools.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all duration-300 group">
                    <CheckCircle className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                    <span className="text-purple-100 group-hover:text-white transition-colors duration-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Technology Stack
              </h2>
              <p className="text-purple-200 mb-8">
                Built with cutting-edge technologies for optimal performance
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {techStack.map((tech, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 hover:bg-white/10 transform hover:scale-105 transition-all duration-300">
                    <div className="font-semibold text-white mb-2">{tech.name}</div>
                    <div className="text-purple-200 text-sm group-hover:text-white">{tech.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-20 bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="w-full px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-purple-100 mb-8 max-w-3xl mx-auto">
            Join thousands of successful traders who trust StockDash for their investment decisions. 
            Start your free trial today and discover the future of trading.
          </p>
          
          <div className="flex gap-4 justify-center">
            <button 
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg shadow-md hover:bg-white/90 transition-all duration-200 flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-purple-700 text-white rounded-lg font-bold text-lg hover:bg-purple-800 transition-all duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}