
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface FinancialChartProps {
  data: { time: string | number; value?: number; open?: number; high?: number; low?: number; close?: number }[];
  type?: 'AREA' | 'CANDLE' | 'LINE';
  height?: number;
  colors?: {
    lineColor?: string;
    topColor?: string;
    bottomColor?: string;
    upColor?: string;
    downColor?: string;
  };
}

const DEFAULT_COLORS = {
    lineColor: '#6366f1',
    topColor: 'rgba(99, 102, 241, 0.4)',
    bottomColor: 'rgba(99, 102, 241, 0.0)',
    upColor: '#22c55e',
    downColor: '#ef4444'
};

export const FinancialChart: React.FC<FinancialChartProps> = ({ 
    data, 
    type = 'AREA', 
    height = 300,
    colors = {}
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  
  // Merge defaults properly
  const finalColors = { ...DEFAULT_COLORS, ...colors };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
      },
    });

    chartRef.current = chart;

    let series: ISeriesApi<any>;

    try {
        if (type === 'AREA') {
            series = chart.addAreaSeries({
                lineColor: finalColors.lineColor,
                topColor: finalColors.topColor,
                bottomColor: finalColors.bottomColor,
                lineWidth: 2,
            });
        } else if (type === 'LINE') {
            series = chart.addLineSeries({
                color: finalColors.lineColor,
                lineWidth: 2,
            });
        } else if (type === 'CANDLE') {
            series = chart.addCandlestickSeries({
                upColor: finalColors.upColor,
                downColor: finalColors.downColor,
                borderVisible: false,
                wickUpColor: finalColors.upColor,
                wickDownColor: finalColors.downColor,
            });
        } else {
            // Default fallback
            series = chart.addAreaSeries({
                lineColor: finalColors.lineColor,
                topColor: finalColors.topColor,
                bottomColor: finalColors.bottomColor,
                lineWidth: 2,
            });
        }

        // 1. Sort data strictly by time
        const sortedData = [...data].sort((a, b) => {
            const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() / 1000 : a.time;
            const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() / 1000 : b.time;
            return timeA - timeB;
        });

        // 2. Validate Data Structure vs Chart Type
        if (sortedData.length > 0) {
            const firstItem = sortedData[0];
            const isCandle = type === 'CANDLE';
            const hasOpen = firstItem.open !== undefined;
            const hasValue = firstItem.value !== undefined;

            if (isCandle && !hasOpen) {
                console.warn('FinancialChart: Type is CANDLE but data is missing "open" property. Skipping setData to prevent crash.');
            } else if (!isCandle && !hasValue) {
                console.warn(`FinancialChart: Type is ${type} but data is missing "value" property. Skipping setData to prevent crash.`);
            } else {
                series.setData(sortedData as any);
                chart.timeScale().fitContent();
            }
        }
    } catch (e) {
        console.error("Error creating chart series:", e);
    }

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
      }
    };
  }, [data, height, type, finalColors.lineColor, finalColors.upColor, finalColors.downColor, finalColors.topColor, finalColors.bottomColor]);

  return <div ref={chartContainerRef} className="w-full rounded-xl overflow-hidden" />;
};
