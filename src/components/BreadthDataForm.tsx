import React, { useState } from 'react';
import { Send, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { BreadthFormData, DailyBreadthData } from '../types/market';

interface BreadthDataFormProps {
  onSubmit: (data: DailyBreadthData) => Promise<void>;
  isSubmitting: boolean;
}

export const BreadthDataForm: React.FC<BreadthDataFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<BreadthFormData>({
    weekHighs52: '',
    weekLows52: '',
    totalStocks: '',
    above10EMA: '',
    above21EMA: '',
    above50EMA: '',
    above100EMA: '',
    above150EMA: '',
    above200EMA: '',
    advancers: '',
    decliners: '',
  });

  const [errors, setErrors] = useState<Partial<BreadthFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BreadthFormData> = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key as keyof BreadthFormData] = 'This field is required';
      } else if (isNaN(Number(value)) || Number(value) < 0) {
        newErrors[key as keyof BreadthFormData] = 'Must be a valid positive number';
      }
    });

    // Additional validation
    const totalStocks = Number(formData.totalStocks);
    if (totalStocks > 0) {
      const fieldsToCheck = ['above10EMA', 'above21EMA', 'above50EMA', 'above100EMA', 'above150EMA', 'above200EMA', 'advancers', 'decliners'];
      
      fieldsToCheck.forEach(field => {
        const value = Number(formData[field as keyof BreadthFormData]);
        if (value > totalStocks) {
          newErrors[field as keyof BreadthFormData] = `Cannot exceed total stocks (${totalStocks})`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BreadthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const dailyData: DailyBreadthData = {
      date: new Date().toISOString().split('T')[0],
      weekHighs52: Number(formData.weekHighs52),
      weekLows52: Number(formData.weekLows52),
      totalStocks: Number(formData.totalStocks),
      above10EMA: Number(formData.above10EMA),
      above21EMA: Number(formData.above21EMA),
      above50EMA: Number(formData.above50EMA),
      above100EMA: Number(formData.above100EMA),
      above150EMA: Number(formData.above150EMA),
      above200EMA: Number(formData.above200EMA),
      advancers: Number(formData.advancers),
      decliners: Number(formData.decliners),
    };

    try {
      await onSubmit(dailyData);
      // Clear form after successful submission
      setFormData({
        weekHighs52: '',
        weekLows52: '',
        totalStocks: '',
        above10EMA: '',
        above21EMA: '',
        above50EMA: '',
        above100EMA: '',
        above150EMA: '',
        above200EMA: '',
        advancers: '',
        decliners: '',
      });
    } catch (error) {
      console.error('Failed to submit data:', error);
    }
  };

  const inputFields = [
    { key: 'weekHighs52', label: '52-Week Highs', icon: TrendingUp },
    { key: 'weekLows52', label: '52-Week Lows', icon: TrendingUp },
    { key: 'totalStocks', label: 'Total Stocks', icon: BarChart3 },
    { key: 'above10EMA', label: 'Above 10 EMA', icon: BarChart3 },
    { key: 'above21EMA', label: 'Above 21 EMA', icon: BarChart3 },
    { key: 'above50EMA', label: 'Above 50 EMA', icon: BarChart3 },
    { key: 'above100EMA', label: 'Above 100 EMA', icon: BarChart3 },
    { key: 'above150EMA', label: 'Above 150 EMA', icon: BarChart3 },
    { key: 'above200EMA', label: 'Above 200 EMA', icon: BarChart3 },
    { key: 'advancers', label: 'Advancers', icon: TrendingUp },
    { key: 'decliners', label: 'Decliners', icon: TrendingUp },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white/90">Daily Market Breadth Data</h2>
          <p className="text-sm text-white/60">Input today's market breadth statistics</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inputFields.map(({ key, label, icon: Icon }) => (
            <div key={key} className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-white/90">
                <Icon className="w-4 h-4 text-white/60" />
                <span>{label}</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData[key as keyof BreadthFormData]}
                onChange={(e) => handleInputChange(key as keyof BreadthFormData, e.target.value)}
                className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors[key as keyof BreadthFormData] 
                    ? 'border-red-500/50 focus:ring-red-500/50' 
                    : 'border-white/20'
                }`}
                placeholder="Enter value"
              />
              {errors[key as keyof BreadthFormData] && (
                <p className="text-xs text-red-400">{errors[key as keyof BreadthFormData]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg transition-colors font-medium text-white"
          >
            <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Data'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};