import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

function StockChart({ data }) {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const lineSeriesRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    try {
      // Create chart instance
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { type: 'solid', color: 'transparent' },
          textColor: '#d1d5db',
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        crosshair: {
          mode: 1,
          vertLine: {
            color: 'rgba(255, 255, 255, 0.4)',
          },
          horzLine: {
            color: 'rgba(255, 255, 255, 0.4)',
          },
        },
      });

      // Create line series
      const lineSeries = chart.addAreaSeries({
        lineColor: 'rgba(147, 51, 234, 0.9)',
        topColor: 'rgba(147, 51, 234, 0.4)',
        bottomColor: 'rgba(147, 51, 234, 0.0)',
        lineWidth: 2,
      });

      // Store references
      chartRef.current = chart;
      lineSeriesRef.current = lineSeries;

      // Handle window resize
      const handleResize = () => {
        if (chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      // Update data if available
      if (data && data.length) {
        const formattedData = data.map(item => ({
          time: Math.floor(new Date(item.ds).getTime() / 1000),
          value: item.yhat,
        }));
        lineSeries.setData(formattedData);
      }

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
          lineSeriesRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, []); // Empty dependency array as we only want to create the chart once

  // Update data when it changes
  useEffect(() => {
    if (lineSeriesRef.current && data && data.length) {
      const formattedData = data.map(item => ({
        time: Math.floor(new Date(item.ds).getTime() / 1000),
        value: item.yhat,
      }));
      lineSeriesRef.current.setData(formattedData);
    }
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: '100%', height: '400px' }}
      className="rounded-lg overflow-hidden"
    />
  );
}

export default StockChart;
