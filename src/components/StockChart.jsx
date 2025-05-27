import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

function StockChart({ data }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const lineSeriesRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart only once
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#ccc',
      },
      crosshair: {
        mode: 1, // Normal mode, shows vertical and horizontal crosshair lines
      },
    });

    lineSeriesRef.current = chartRef.current.addLineSeries({
      color: 'rgb(75, 192, 192)',
      lineWidth: 2,
    });

    // Handle window resize
    const handleResize = () => {
      chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (data && data.length && lineSeriesRef.current) {
      // Convert your data to {time, value} format
      // Assuming data is like [{ ds: '2025-05-17', yhat: 123.45 }, ...]
      const formattedData = data.map(item => ({
        time: Math.floor(new Date(item.ds).getTime() / 1000), // UNIX timestamp (seconds)
        value: item.yhat,
      }));
      lineSeriesRef.current.setData(formattedData);
    }
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />;
}

export default StockChart;
