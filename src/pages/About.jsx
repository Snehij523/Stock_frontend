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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
      {/* Hero Section */}
      <div className="about-hero">
        <div className={`about-hero-content ${isVisible ? 'fade-in-up' : ''}`}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50px',
            padding: '0.75rem 1.5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <Zap className="float" style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
            <span style={{ color: 'white', fontWeight: '600' }}>Next-Generation Trading Platform</span>
          </div>
          
          <h1 className="about-hero-title">
            StockDash
            <span className="about-hero-subtitle">Professional Trading Suite</span>
          </h1>
          
          <p className="about-hero-desc">
            Revolutionizing stock market analysis with cutting-edge AI technology, real-time data visualization, 
            and predictive analytics that empower traders to make informed investment decisions.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <button className="about-btn-primary">
              Start Free Trial
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </button>
            <button className="about-btn-secondary">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
              <stat.icon style={{ width: '40px', height: '40px', color: '#3b82f6', margin: '0 auto 1rem' }} />
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Powerful Trading Features</h2>
          <p className="section-subtitle">
            Discover the advanced tools that make StockDash the preferred choice of professional traders worldwide.
          </p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="benefits-grid">
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              Why Choose StockDash?
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem', lineHeight: '1.7' }}>
              Built with modern technologies and designed for performance, our platform delivers 
              exceptional user experience and reliable trading tools.
            </p>
            
            <div className="benefits-list">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <CheckCircle style={{ width: '24px', height: '24px' }} />
                  <span style={{ fontWeight: '500' }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="tech-showcase">
            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>
              Technology Stack
            </h3>
            <p style={{ opacity: '0.9', marginBottom: '2rem' }}>
              Built with cutting-edge technologies for optimal performance
            </p>
            
            <div className="tech-grid">
              {techStack.map((tech, index) => (
                <div key={index} className="tech-item">
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{tech.name}</div>
                  <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container">
        <div className="cta-section">
          <h2 className="cta-title">Ready to Transform Your Trading?</h2>
          <p className="cta-desc">
            Join thousands of successful traders who trust StockDash for their investment decisions. 
            Start your free trial today and discover the future of trading.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <button 
              className="about-btn-primary"
              style={{ background: 'white', color: '#e91e63' }}
            >
              Start Free Trial
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </button>
            <button className="about-btn-secondary">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}