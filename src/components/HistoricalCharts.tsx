import React from 'react';
import { HistoricalData, TimeRange } from '../types/market';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface HistoricalChartsProps {
  data: HistoricalData[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const HistoricalCharts: React.FC<HistoricalChartsProps> = ({ 
  data, 
  timeRange, 
  onTimeRangeChange 
}) => {
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: 'MAX', label: 'Max' },
  ];

  const emaCharts = [
    { period: 10, color: '#10B981', data: data.map(d => ({ date: d.date, value: d.above10EMA })) },
    { period: 21, color: '#3B82F6', data: data.map(d => ({ date: d.date, value: d.above21EMA })) },
    { period: 50, color: '#8B5CF6', data: data.map(d => ({ date: d.date, value: d.above50EMA })) },
    { period: 100, color: '#F59E0B', data: data.map(d => ({ date: d.date, value: d.above100EMA })) },
    { period: 150, color: '#EC4899', data: data.map(d => ({ date: d.date, value: d.above150EMA })) },
    { period: 200, color: '#EF4444', data: data.map(d => ({ date: d.date, value: d.above200EMA })) },
  ];

  const renderMiniChart = (chartData: { date: string; value: number }[], color: string) => {
    if (chartData.length === 0) return null;

    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = Math.min(...chartData.map(d => d.value));
    const range = maxValue - minValue || 1;

    return (
      <div className="h-20 flex items-end space-x-1">
        {chartData.slice(-30).map((point, index) => {
          const height = ((point.value - minValue) / range) * 100;
          return (
            <div
              key={index}
              className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
              style={{
                backgroundColor: color,
                height: `${Math.max(height, 5)}%`,
                opacity: 0.8,
              }}
              title={`${point.date}: ${point.value}%`}
            />
          );
        })}
      </div>
    );
  };

  const calculateHealthScore = () => {
    if (data.length === 0) return 0;
    const latest = data[data.length - 1];
    return latest.healthScore || 0;
  };

 const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 70) return 'text-green-300';
    if (score >= 60) return 'text-emerald-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Bullish';
    if (score >= 70) return 'Very Strong';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Neutral';
    if (score >= 30) return 'Weak';
    return 'Bearish';
  };

  return (
    <div className="space-y-6">
      {/* Time Range Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white/90">Historical Analysis</h2>
              <p className="text-sm text-white/60">Market breadth trends over time</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Market Health Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white/90">Health Score</span>
            </div>
           <div className={`text-2xl font-bold ${getHealthColor(calculateHealthScore())}`}>
              {getHealthLabel(calculateHealthScore())}
            </div>
            <div className="text-xs text-white/60">
              Score: {calculateHealthScore().toFixed(1)} - Overall market strength
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-white/90">Data Points</span>
            </div>
            <div className="text-2xl font-bold text-white/90">{data.length}</div>
            <div className="text-xs text-white/60">Historical records</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-white/90">Time Range</span>
            </div>
            <div className="text-2xl font-bold text-white/90">
              {timeRanges.find(r => r.value === timeRange)?.label}
            </div>
            <div className="text-xs text-white/60">Selected period</div>
          </div>
        </div>
      </div>

      {/* EMA Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emaCharts.map((chart) => (
          <div key={chart.period} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white/90">{chart.period} EMA</h3>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: chart.color }}
              />
            </div>
            
            {chart.data.length > 0 ? (
              <>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-white/90">
                    {chart.data[chart.data.length - 1]?.value.toFixed(1)}%
                  </div>
                  <div className="text-xs text-white/60">
                    Latest: {chart.data[chart.data.length - 1]?.date}
                  </div>
                </div>
                
                {renderMiniChart(chart.data, chart.color)}
                
                <div className="mt-3 flex justify-between text-xs text-white/60">
                  <span>Min: {Math.min(...chart.data.map(d => d.value)).toFixed(1)}%</span>
                  <span>Max: {Math.max(...chart.data.map(d => d.value)).toFixed(1)}%</span>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-white/60">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No data available</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};