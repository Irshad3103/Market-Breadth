import { useState, useEffect } from 'react';
import { HistoricalData, TimeRange } from '../types/market';
import { apiService } from '../services/api';

export const useHistoricalData = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = async (range: TimeRange = timeRange) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getHistoricalData(range);
      setHistoricalData(data);
    } catch (err) {
      setError('Failed to fetch historical data');
      console.error('Error fetching historical data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimeRange = (range: TimeRange) => {
    setTimeRange(range);
    fetchHistoricalData(range);
  };

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  return {
    historicalData,
    timeRange,
    isLoading,
    error,
    updateTimeRange,
    refetch: () => fetchHistoricalData(timeRange),
  };
};