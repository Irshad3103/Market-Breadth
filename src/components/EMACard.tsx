import React from 'react';
import { EMAData } from '../types/market';

interface EMACardProps {
  emaData: EMAData;
}

export const EMACard: React.FC<EMACardProps> = ({ emaData }) => {
  const getProgressBarColor = () => {
    if (emaData.percentage >= 70) return 'bg-green-500';
    if (emaData.percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (emaData.percentage >= 70) return 'text-green-400';
    if (emaData.percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white/90">
          {emaData.period} EMA
        </h3>
        <span className={`text-2xl font-bold ${getTextColor()}`}>
          {emaData.percentage}%
        </span>
      </div>
      
      <div className="w-full bg-white/10 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${getProgressBarColor()}`}
          style={{ width: `${emaData.percentage}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-white/60">
        Stocks above {emaData.period}-period EMA
      </div>
    </div>
  );
};