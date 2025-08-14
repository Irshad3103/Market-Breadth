import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { TodayGains } from '../types/market';

interface TodayGainsCardProps {
    todayGains: TodayGains;
}
 export  const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
export const TodayGainsCard: React.FC<TodayGainsCardProps> = ({ todayGains }) => {
    const getGainColor = (value: number) => {
        if (value > 0) return 'text-green-400';
        if (value < 0) return 'text-red-400';
        return 'text-white/70';
    };

    const getGainIcon = (value: number) => {
        if (value > 0) return <TrendingUp className="w-5 h-5" />;
        if (value < 0) return <TrendingDown className="w-5 h-5" />;
        return <DollarSign className="w-5 h-5" />;
    };

  

    return (
        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white/90">Today's Performance</h3>
                <div className={`flex items-center space-x-1 ${getGainColor(todayGains)}`}>
                    {getGainIcon(todayGains)}
                </div>
            </div>

            <div className="space-y-4">
                {/* Portfolio Today's Gain */}
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-sm text-white/70 mb-1">Basket Performance</div>
                    {/* <div className={`text-2xl font-bold ${getGainColor(todayGains)}`}>
                        {todayGains > 0 ? '+' : ''}{formatCurrency((todayGains*1000000)/100)}
                    </div> */}
                    <div className={`text-sm ${getGainColor(todayGains)}`}>
                        ({todayGains > 0 ? '+' : ''}{todayGains}%)
                    </div>
                    
                </div>
                

                {/* Market Indices */}
                {/* <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-xs text-white/70 mb-1">NIFTY 50</div>
                        <div className={`text-sm font-medium ${getGainColor(todayGains.niftyGain)}`}>
                            {todayGains.niftyGain > 0 ? '+' : ''}{todayGains.niftyGain.toFixed(0)}
                        </div>
                        <div className={`text-xs ${getGainColor(todayGains.niftyGainPercent)}`}>
                            ({todayGains.niftyGainPercent > 0 ? '+' : ''}{todayGains.niftyGainPercent.toFixed(2)}%)
                        </div>
                    </div>

                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-xs text-white/70 mb-1">SENSEX</div>
                        <div className={`text-sm font-medium ${getGainColor(todayGains.sensexGain)}`}>
                            {todayGains.sensexGain > 0 ? '+' : ''}{todayGains.sensexGain.toFixed(0)}
                        </div>
                        <div className={`text-xs ${getGainColor(todayGains.sensexGainPercent)}`}>
                            ({todayGains.sensexGainPercent > 0 ? '+' : ''}{todayGains.sensexGainPercent.toFixed(2)}%)
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};