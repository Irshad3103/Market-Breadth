import { StockData } from '../types/market';
import Papa from "papaparse";
// Simulated S&P 500 stock data with realistic EMA values
export const generateMockStockData = async (): StockData[] => {
  // const stockSymbols = [
  //   { symbol: 'AAPL', name: 'Apple Inc.' },
  //   { symbol: 'MSFT', name: 'Microsoft Corporation' },
  //   { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  //   { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  //   { symbol: 'TSLA', name: 'Tesla Inc.' },
  //   { symbol: 'META', name: 'Meta Platforms Inc.' },
  //   { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  //   { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  //   { symbol: 'JNJ', name: 'Johnson & Johnson' },
  //   { symbol: 'V', name: 'Visa Inc.' },
  //   { symbol: 'PG', name: 'Procter & Gamble Co.' },
  //   { symbol: 'UNH', name: 'UnitedHealth Group Inc.' },
  //   { symbol: 'HD', name: 'The Home Depot Inc.' },
  //   { symbol: 'MA', name: 'Mastercard Inc.' },
  //   { symbol: 'BAC', name: 'Bank of America Corp.' },
  //   { symbol: 'DIS', name: 'The Walt Disney Company' },
  //   { symbol: 'ADBE', name: 'Adobe Inc.' },
  //   { symbol: 'NFLX', name: 'Netflix Inc.' },
  //   { symbol: 'XOM', name: 'Exxon Mobil Corporation' },
  //   { symbol: 'KO', name: 'The Coca-Cola Company' },
  // ];
  const stockSymbols: any[] = await getStocksList();

  return stockSymbols.map(stock => {

    return {

      symbol: stock.SYMBOL,
      name: stock.NAME_OF_COMPANY,
      price: stock.Price,
      ema10: stock.SMA10,
      ema21: stock.SMA21,
      ema50: stock.SMA50,
      ema100: stock.SMA100,
      ema200: stock.SMA200,

    };
  });
};

export const calculateMarketBreadth = (stocks: StockData[]) => {
  const total = stocks.length;

  const above10EMA = stocks.filter(s => Number(s.price) > Number(s.ema10)).length;
  const above21EMA = stocks.filter(s => Number(s.price) > Number(s.ema21)).length;
  const above50EMA = stocks.filter(s => Number(s.price) > Number(s.ema50)).length;
  const above100EMA = stocks.filter(s => Number(s.price) > Number(s.ema100)).length;
  const above200EMA = stocks.filter(s => Number(s.price) > Number(s.ema200)).length;

// const total = 1000;

//   const above10EMA =200 ;
//   const above21EMA = 600;
//   const above50EMA = 700;
//   const above100EMA = 400;
//   const above200EMA = 300;





  const formatPercent = (count: number) =>
    Math.round((count / total) * 100 * 100) / 100;

  // === Allocation logic ===
  let equityAllocation = 0;
  if (formatPercent(above10EMA) > 50) equityAllocation += 20;
  if (formatPercent(above21EMA) > 50) equityAllocation += 20;
  if (formatPercent(above50EMA) > 50) equityAllocation += 20;
  if (formatPercent(above100EMA) > 50) equityAllocation += 20;
  if (formatPercent(above200EMA) > 50) equityAllocation += 20;

  const allocation = {
    equity: equityAllocation,
    cash: 100 - equityAllocation
  };

  // === Market health mapping ===
  let marketHealth: 'bearish' | 'weak' | 'neutral' | 'strong' | 'very strong' | 'bullish' = 'neutral';
  switch (equityAllocation) {
    case 0:
      marketHealth = 'bearish';
      break;
    case 20:
      marketHealth = 'weak';
      break;
    case 40:
      marketHealth = 'neutral';
      break;
    case 60:
      marketHealth = 'strong';
      break;
    case 80:
      marketHealth = 'very strong';
      break;
    case 100:
      marketHealth = 'bullish';
      break;
  }

  return {
    above10EMA: formatPercent(above10EMA),
    above21EMA: formatPercent(above21EMA),
    above50EMA: formatPercent(above50EMA),
    above100EMA: formatPercent(above100EMA),
    above200EMA: formatPercent(above200EMA),
    totalStocks: total,
    allocation,
    marketHealth,
    lastUpdated: new Date(),
  };
};







// Async function to fetch and parse the CSV
const getStocksList = async () => {
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTL_CCOjZUBl3Cv4nLkZCJUuITvbV2xN6v21gf68uEjG93J5sJR4F4R3_HrfrB5kfkQKkZrydgKKiDh/pub?gid=1773129000&single=true&output=csv";

  try {
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const csvText = await res.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length) {
      console.warn("CSV parse errors:", parsed.errors);
    }

    return parsed.data; // returns an array of stock objects
  } catch (err) {
    console.error(err);
    return [];
  }
};


// export const calculateMarketBreadth = (stocks: StockData[]) => {
//   //  const total = 1000;

//   // const above10EMA = 800;
//   // const above21EMA = 700;
//   // const above50EMA = 600;
//   // const above100EMA = 900;
//   // const above200EMA = 950;
//   const total = stocks.length;

//   const above10EMA = stocks.filter(s => Number(s.price) > Number(s.ema10)).length;
//   const above21EMA = stocks.filter(s => Number(s.price) > Number(s.ema21)).length;
//   const above50EMA = stocks.filter(s => Number(s.price) > Number(s.ema50)).length;
//   const above100EMA = stocks.filter(s => Number(s.price) > Number(s.ema100)).length;
//   const above200EMA = stocks.filter(s => Number(s.price) > Number(s.ema200)).length;

//   const averagePercentage =
//     ((above10EMA + above21EMA + above50EMA + above100EMA + above200EMA) / (5 * total)) * 100;

//   let marketHealth: 'bearish' | 'neutral' | 'bullish' = 'neutral';
//   let allocation = { equity: 50, cash: 50 }; // default neutral allocation

//   if (averagePercentage > 60) {
//     marketHealth = 'bullish';
//     allocation = { equity: 90, cash: 10 };
//   } else if (averagePercentage < 40) {
//     marketHealth = 'bearish';
//     allocation = { equity: 20, cash: 80 };
//   }

//   const formatPercent = (count: number) =>
//     Math.round((count / total) * 100 * 100) / 100;

//   return {
//     above10EMA: formatPercent(above10EMA),
//     above21EMA: formatPercent(above21EMA),
//     above50EMA: formatPercent(above50EMA),
//     above100EMA: formatPercent(above100EMA),
//     above200EMA: formatPercent(above200EMA),
//     totalStocks: total,
//     marketHealth,
//     allocation,
//     lastUpdated: new Date(),
//   };
// };