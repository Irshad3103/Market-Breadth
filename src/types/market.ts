export interface StockData {
  symbol: string;
  name: string;
  price: number;
  ema10: number;
  ema21: number;
  ema50: number;
  ema100: number;
  ema200: number;
}

export interface MarketBreadth {
  above10EMA: number;
  above21EMA: number;
  above50EMA: number;
  above100EMA: number;
  above200EMA: number;
  totalStocks: number;
  marketHealth: 'bearish' | 'neutral' | 'bullish';
  allocation : allocation;
  lastUpdated: Date;
}

export interface EMAData {
  period: number;
  percentage: number;
  color: string;
}
interface allocation {
  equity: number;
  cash: number;
  
}