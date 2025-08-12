import { useState, useEffect } from 'react';
import { StockData, MarketBreadth } from '../types/market';
import { generateMockStockData, calculateMarketBreadth } from '../data/stockData';

export const useMarketData = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [marketBreadth, setMarketBreadth] = useState<MarketBreadth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 const updateData = async () => {
  setIsLoading(true);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newStocks = await generateMockStockData();
  const newMarketBreadth = calculateMarketBreadth(newStocks);

  setStocks(newStocks);
  setMarketBreadth(newMarketBreadth);
  setIsLoading(false);
};


  useEffect(() => {
    updateData();
    
    // Update data every 30 seconds
    const interval = setInterval(updateData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { stocks, marketBreadth, isLoading, updateData };
};