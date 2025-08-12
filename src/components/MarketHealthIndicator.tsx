import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketBreadth } from '../types/market';

interface MarketHealthIndicatorProps {
  marketBreadth: MarketBreadth;
}

export const MarketHealthIndicator: React.FC<MarketHealthIndicatorProps> = ({ marketBreadth }) => {
  const getHealthIcon = () => {
    switch (marketBreadth.marketHealth) {
      case 'bullish':
        return <TrendingUp className="w-6 h-6 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="w-6 h-6 text-red-400" />;
      default:
        return <Minus className="w-6 h-6 text-yellow-400" />;
    }
  };

  const getHealthColor = () => {
    switch (marketBreadth.marketHealth) {
      case 'bullish':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'bearish':
        return 'text-red-400 border-red-400/30 bg-red-400/10';
      default:
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    }
  };

  const averagePercentage = (
    marketBreadth.above10EMA +
    marketBreadth.above21EMA +
    marketBreadth.above50EMA +
    marketBreadth.above100EMA +
    marketBreadth.above200EMA
  ) / 5;

  return (
    <div className={`p-6 rounded-xl border backdrop-blur-sm ${getHealthColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Market Health</h2>
        {getHealthIcon()}
      </div>

      <div className="text-3xl font-bold mb-2">
        {marketBreadth.marketHealth.toUpperCase()}
      </div>
      <div className="text-sm opacity-75 mb-4">
        Allocation: Equity - {marketBreadth?.allocation.equity}%, Cash - {marketBreadth?.allocation.cash}%
      </div>
      <div className="text-sm opacity-75 mb-4">
        Average: {averagePercentage.toFixed(1)}% above EMAs
      </div>

      <div className="text-xs opacity-60">
        Last updated: {marketBreadth.lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
};