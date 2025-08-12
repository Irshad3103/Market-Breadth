import React from 'react';
import { RefreshCw, BarChart3, TrendingUp, Plus, Database } from 'lucide-react';
import { useMarketData } from './hooks/useMarketData';
import { useHistoricalData } from './hooks/useHistoricalData';
import { MarketHealthIndicator } from './components/MarketHealthIndicator';
import { EMACard } from './components/EMACard';
import { MarketBreadthChart } from './components/MarketBreadthChart';
import { StockTable } from './components/StockTable';
import { BreadthDataForm } from './components/BreadthDataForm';
import { HistoricalCharts } from './components/HistoricalCharts';
import { EMAData } from './types/market';
import { DailyBreadthData } from './types/market';
import { apiService } from './services/api';

function App() {
  const { stocks, marketBreadth, isLoading, updateData } = useMarketData();
  const { historicalData, timeRange, isLoading: isHistoricalLoading, updateTimeRange } = useHistoricalData();
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'input' | 'historical'>('dashboard');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleBreadthDataSubmit = async (data: DailyBreadthData) => {
    setIsSubmitting(true);
    try {
      await apiService.submitBreadthData(data);
      // Optionally refresh historical data after submission
      // await refetch();
    } catch (error) {
      console.error('Failed to submit breadth data:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBackgroundClass = () => {
    if (!marketBreadth) return 'bg-gradient-to-br from-slate-900 to-slate-800';

    switch (marketBreadth.marketHealth) {
      case 'bullish':
        return 'bg-gradient-to-br from-green-900 via-slate-900 to-emerald-900';
      case 'bearish':
        return 'bg-gradient-to-br from-red-900 via-slate-900 to-rose-900';
      default:
        return 'bg-gradient-to-br from-amber-900 via-slate-900 to-orange-900';
    }
  };

  const emaDataArray: EMAData[] = marketBreadth ? [
    { period: 10, percentage: marketBreadth.above10EMA, color: '#10B981' },
    { period: 21, percentage: marketBreadth.above21EMA, color: '#3B82F6' },
    { period: 50, percentage: marketBreadth.above50EMA, color: '#8B5CF6' },
    { period: 100, percentage: marketBreadth.above100EMA, color: '#F59E0B' },
    { period: 200, percentage: marketBreadth.above200EMA, color: '#EF4444' },
  ] : [];

  if (isLoading && !marketBreadth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white/50 mx-auto mb-4"></div>
          <p className="text-white/70">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${getBackgroundClass()}`}>
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <BarChart3 className="w-8 h-8 text-white/90" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white/90">Market Breadth Analyzer</h1>
                <p className="text-white/60">Real-time EMA analysis dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Navigation Tabs */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('input')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'input' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Input Data</span>
                </button>

                <button
                  onClick={() => setActiveTab('historical')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'historical' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Historical</span>
                </button>
              </div>

              <button
                onClick={updateData}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-white/90 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-white/90">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && marketBreadth && (
          <>
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <MarketHealthIndicator marketBreadth={marketBreadth} />
              </div>

              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {emaDataArray.slice(0, 3).map((emaData) => (
                    <EMACard key={emaData.period} emaData={emaData} />
                  ))}
                </div>
              </div>
            </div>

            {/* EMA Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {emaDataArray.map((emaData) => (
                <EMACard key={emaData.period} emaData={emaData} />
              ))}
            </div>

            {/* Charts and Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MarketBreadthChart marketBreadth={marketBreadth} />

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white/90 mb-4">Market Insights</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span className="font-medium text-white/90">Short-term Momentum</span>
                    </div>
                    <p className="text-sm text-white/70">
                      {marketBreadth.above10EMA >= 70 ? 'Strong bullish momentum with most stocks above 10 EMA' :
                       marketBreadth.above10EMA >= 50 ? 'Moderate momentum, mixed signals' :
                       'Weak momentum, potential bearish pressure'}
                    </p>
                    <div className="mt-2 text-xs text-white/50">
                      {marketBreadth.above10EMA}% above 10 EMA
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <span className="font-medium text-white/90">Long-term Trend</span>
                    </div>
                    <p className="text-sm text-white/70">
                      {marketBreadth.above200EMA >= 60 ? 'Strong long-term uptrend established' :
                       marketBreadth.above200EMA >= 40 ? 'Mixed long-term signals' :
                       'Long-term trend showing weakness'}
                    </p>
                    <div className="mt-2 text-xs text-white/50">
                      {marketBreadth.above200EMA}% above 200 EMA
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-green-400" />
                      <span className="font-medium text-white/90">Overall Assessment</span>
                    </div>
                    <p className="text-sm text-white/70">
                      Market breadth indicates {marketBreadth.marketHealth} conditions. 
                      {marketBreadth.marketHealth === 'bullish' ? ' Consider maintaining long positions.' :
                       marketBreadth.marketHealth === 'bearish' ? ' Exercise caution and consider defensive strategies.' :
                       ' Monitor for directional confirmation.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Table */}
            <StockTable stocks={stocks} />
          </>
        )}

        {/* Input Data Tab */}
        {activeTab === 'input' && (
          <BreadthDataForm 
            onSubmit={handleBreadthDataSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Historical Tab */}
        {activeTab === 'historical' && (
          <>
            {isHistoricalLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white/50 mx-auto mb-4"></div>
                <p className="text-white/70">Loading historical data...</p>
              </div>
            ) : (
              <HistoricalCharts 
                data={historicalData}
                timeRange={timeRange}
                onTimeRangeChange={updateTimeRange}
              />
            )}
          </>
        )}

        {/* Loading state for dashboard */}
        {activeTab === 'dashboard' && !marketBreadth && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <MarketHealthIndicator marketBreadth={marketBreadth} />
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {emaDataArray.slice(0, 3).map((emaData) => (
                  <EMACard key={emaData.period} emaData={emaData} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;


// import React, { useEffect, useState } from "react";
// import Papa from "papaparse";

// // Default export React component
// // Usage: place this component in a create-react-app or Vite project.
// // npm install papaparse
// // Tailwind classes are used but not required — remove if not using Tailwind.

// export default function App() {
//   const CSV_URL =
//     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTL_CCOjZUBl3Cv4nLkZCJUuITvbV2xN6v21gf68uEjG93J5sJR4F4R3_HrfrB5kfkQKkZrydgKKiDh/pub?gid=1773129000&single=true&output=csv";

//   const [rows, setRows] = useState([]);
//   const [headers, setHeaders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCsv = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const res = await fetch(CSV_URL);
//         if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
//         const csvText = await res.text();

//         // Parse CSV using PapaParse
//         const parsed = Papa.parse(csvText, {
//           header: true,
//           skipEmptyLines: true,
//         });

//         if (parsed.errors && parsed.errors.length) {
//           console.warn("CSV parse errors:", parsed.errors);
//         }

//         setRows(parsed.data);
//         setHeaders(parsed.meta.fields || (parsed.data[0] ? Object.keys(parsed.data[0]) : []));
//       } catch (err) {
//         console.error(err);
//         setError(err.message || String(err));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCsv();
//   }, []);

//   // Send parsed JSON to your backend/tool
//   const sendToBackend = async () => {
//     try {
//       const res = await fetch("/api/upload-csv-json", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ rows }),
//       });

//       if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
//       const json = await res.json();
//       alert("Upload successful: " + JSON.stringify(json).slice(0, 200));
//     } catch (err) {
//       alert("Upload error: " + err.message);
//     }
//   };

//   // Download parsed JSON locally
//   const downloadJSON = () => {
//     const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "sheet-data.json";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
//       <div className="max-w-5xl mx-auto">
//         <header className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-semibold">Google Sheet → CSV → React</h1>
//           <div className="space-x-2">
//             <button
//               onClick={downloadJSON}
//               className="px-3 py-1 bg-white border rounded shadow-sm hover:shadow"
//             >
//               Download JSON
//             </button>
//             <button
//               onClick={sendToBackend}
//               className="px-3 py-1 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700"
//             >
//               Send to backend
//             </button>
//           </div>
//         </header>

//         <section className="mb-4">
//           <p className="text-sm text-gray-600">Source CSV URL:</p>
//           <code className="block break-words bg-white p-2 rounded mt-1">{CSV_URL}</code>
//         </section>

//         <main>
//           {loading && <p>Loading CSV…</p>}
//           {error && <p className="text-red-600">Error: {error}</p>}

//           {!loading && !error && rows.length === 0 && <p>No rows found.</p>}

//           {rows.length > 0 && (
//             <div className="overflow-auto border rounded bg-white">
//               <table className="min-w-full text-left table-auto">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     {headers.map((h) => (
//                       <th key={h} className="px-3 py-2 text-sm font-medium border-b">
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.map((row, i) => (
//                     <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
//                       {headers.map((h) => (
//                         <td key={h} className="px-3 py-2 align-top text-sm border-b">
//                           {row[h]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </main>

//         <footer className="mt-6 text-xs text-gray-500">
//           Tip: if you need auth-protected sheets, use the Google Sheets API on a backend and return the
//           processed CSV/JSON to the frontend. This example requires the sheet to be published or shared
//           publicly for the direct CSV export link to work.
//         </footer>
//       </div>
//     </div>
//   );
// }
