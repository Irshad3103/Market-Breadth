import { DailyBreadthData, HistoricalData, TimeRange } from '../types/market';

const API_BASE_URL = '/api';

// Mock API service for demonstration
class ApiService {
  private mockData: DailyBreadthData[] = [];

  async submitBreadthData(data: DailyBreadthData): Promise<void> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Add to mock data
          this.mockData.push(data);
          console.log('Data submitted successfully:', data);
          resolve();
        } catch (error) {
          reject(new Error('Failed to submit data'));
        }
      }, 1000);
    });
  }

  async getHistoricalData(timeRange: TimeRange = 'MAX'): Promise<HistoricalData[]> {
    // Simulate API call with mock historical data
    return new Promise((resolve) => {
      setTimeout(() => {
        const historicalData = this.generateMockHistoricalData(timeRange);
        resolve(historicalData);
      }, 500);
    });
  }

  private generateMockHistoricalData(timeRange: TimeRange): HistoricalData[] {
    const days = this.getDaysForTimeRange(timeRange);
    const data: HistoricalData[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic market breadth data with some trends
      const baseStrength = 50 + Math.sin(i / 10) * 20 + Math.random() * 10 - 5;
      
      const above10EMA = Math.max(0, Math.min(100, baseStrength + Math.random() * 20 - 10));
      const above21EMA = Math.max(0, Math.min(100, above10EMA - 5 + Math.random() * 10 - 5));
      const above50EMA = Math.max(0, Math.min(100, above21EMA - 5 + Math.random() * 10 - 5));
      const above100EMA = Math.max(0, Math.min(100, above50EMA - 5 + Math.random() * 10 - 5));
      const above150EMA = Math.max(0, Math.min(100, above100EMA - 3 + Math.random() * 6 - 3));
      const above200EMA = Math.max(0, Math.min(100, above150EMA - 3 + Math.random() * 6 - 3));
      
      const healthScore = (above10EMA + above21EMA + above50EMA + above100EMA + above150EMA + above200EMA) / 6;
      
      let marketHealth: 'bearish' | 'neutral' | 'bullish' = 'neutral';
      if (healthScore > 60) marketHealth = 'bullish';
      else if (healthScore < 40) marketHealth = 'bearish';
      
      data.push({
        date: date.toISOString().split('T')[0],
        above10EMA: Math.round(above10EMA * 100) / 100,
        above21EMA: Math.round(above21EMA * 100) / 100,
        above50EMA: Math.round(above50EMA * 100) / 100,
        above100EMA: Math.round(above100EMA * 100) / 100,
        above150EMA: Math.round(above150EMA * 100) / 100,
        above200EMA: Math.round(above200EMA * 100) / 100,
        marketHealth,
        healthScore: Math.round(healthScore * 100) / 100,
      });
    }
    
    return data;
  }

  private getDaysForTimeRange(timeRange: TimeRange): number {
    switch (timeRange) {
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      case 'MAX': return 730; // 2 years
      default: return 365;
    }
  }
}

export const apiService = new ApiService();