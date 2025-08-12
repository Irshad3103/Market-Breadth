import React from 'react';
import { StockData } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockTableProps {
  stocks: StockData[];
}

export const StockTable: React.FC<StockTableProps> = ({ stocks }) => {
  console.log("fffffffffffff", stocks)
  const isAboveEMA = (price: number, ema: number) => price > ema;

  const getEMAStatus = (price: number, ema: number) => {
    return isAboveEMA(price, ema) ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-400" />
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white/90">Stock Analysis</h2>
        <p className="text-sm text-white/60 mt-1">Price vs EMA comparison for sample stocks</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-white/90 font-semibold">Symbol</th>
              <th className="text-left p-4 text-white/90 font-semibold">Price</th>
              <th className="text-center p-4 text-white/90 font-semibold">10 EMA</th>
              <th className="text-center p-4 text-white/90 font-semibold">21 EMA</th>
              <th className="text-center p-4 text-white/90 font-semibold">50 EMA</th>
              <th className="text-center p-4 text-white/90 font-semibold">100 EMA</th>
              <th className="text-center p-4 text-white/90 font-semibold">200 EMA</th>
            </tr>
          </thead>
          <tbody>
            {stocks?.slice(0, 10).map((stock, index) => (
              <tr
                key={stock.symbol}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index % 2 === 0 ? 'bg-white/2' : ''
                  }`}
              >
                <td className="p-4">
                  <div>
                    <div className="font-medium text-white/90">{stock.symbol}</div>
                    <div className="text-xs text-white/60 truncate max-w-[120px]">{stock.name}</div>
                  </div>
                </td>
                <td className="p-4 text-white/90 font-medium">${stock.price}</td>
                <td className="p-4 text-center">{getEMAStatus(stock.price, stock.ema10)}</td>
                <td className="p-4 text-center">{getEMAStatus(stock.price, stock.ema21)}</td>
                <td className="p-4 text-center">{getEMAStatus(stock.price, stock.ema50)}</td>
                <td className="p-4 text-center">{getEMAStatus(stock.price, stock.ema100)}</td>
                <td className="p-4 text-center">{getEMAStatus(stock.price, stock.ema200)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};