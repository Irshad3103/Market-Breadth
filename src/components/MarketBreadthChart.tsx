import React from 'react';
import { MarketBreadth } from '../types/market';

interface MarketBreadthChartProps {
  marketBreadth: MarketBreadth;
}

export const MarketBreadthChart: React.FC<MarketBreadthChartProps> = ({ marketBreadth }) => {
  const chartData = [
    { period: '10 EMA', percentage: marketBreadth.above10EMA },
    { period: '21 EMA', percentage: marketBreadth.above21EMA },
    { period: '50 EMA', percentage: marketBreadth.above50EMA },
    { period: '100 EMA', percentage: marketBreadth.above100EMA },
    { period: '200 EMA', percentage: marketBreadth.above200EMA },
  ];

  const maxPercentage = Math.max(...chartData.map(d => d.percentage));

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white/90">Market Breadth Overview</h2>
        <p className="text-sm text-white/60 mt-1">Percentage of stocks trading above key EMAs</p>
      </div>
      
      <div className="space-y-4">
        {chartData.map((data, index) => (
          <div key={data.period} className="relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white/90">{data.period}</span>
              <span className={`text-sm font-bold ${
                data.percentage >= 70 ? 'text-green-400' : 
                data.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {data.percentage}%
              </span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-4 relative overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                  data.percentage >= 70 ? 'bg-gradient-to-r from-green-500 to-green-400' : 
                  data.percentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                  'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ 
                  width: `${data.percentage}%`,
                  animationDelay: `${index * 100}ms`
                }}
              ></div>
              
              {/* Gradient overlay for visual enhancement */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Market Sentiment:</span>
          <span className={`font-semibold ${
            marketBreadth.marketHealth === 'bullish' ? 'text-green-400' :
            marketBreadth.marketHealth === 'bearish' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {marketBreadth.marketHealth.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};