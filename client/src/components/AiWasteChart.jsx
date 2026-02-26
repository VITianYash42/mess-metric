// client/src/components/AiWasteChart.jsx
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';

const AiWasteChart = () => {
  const [data, setData] = useState([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  // Pointing to your Python AI Engine port
  const AI_API_URL = import.meta.env.VITE_AI_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        // Fetching the new 5-day forecast from your updated app.py
        const response = await axios.get(`${AI_API_URL}/api/ai/forecast`);
        
        if (response.data.success) {
          setData(response.data.data.chartData);
          setInsight(response.data.data.insight);
        }
      } catch (error) {
        console.warn("AI Server busy or offline, using fallback data");
        // Fallback standard data so the UI doesn't break if Python is down
        setData([
          { day: "Mon", predictedWasteKg: 40 },
          { day: "Tue", predictedWasteKg: 42 },
          { day: "Wed", predictedWasteKg: 38 },
          { day: "Thu", predictedWasteKg: 45 },
          { day: "Fri", predictedWasteKg: 35 }
        ]);
        setInsight("AI Model offline. Showing baseline forecast.");
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (loading) return <div className="text-center p-10 text-emerald-600 animate-pulse">🤖 AI is calculating forecast...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-emerald-100"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📈</span> AI Waste Forecast
          </h2>
          <p className="text-sm text-gray-500 ml-9">Predicted waste for the next 5 days</p>
        </div>
        <div className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium shadow-sm">
          Live Model v1.0
        </div>
      </div>

      {/* Render the dynamic AI Insight here */}
      {insight && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm font-medium flex items-start gap-2">
          <span className="text-amber-500 text-base">💡</span> 
          <span>{insight}</span>
        </div>
      )}
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#9ca3af', fontSize: 12}} 
              dy={10} 
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#9ca3af', fontSize: 12}} 
              tickFormatter={(value) => `${value}`} 
            />
            
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`${value} kg`, "Predicted Waste"]}
            />
            
            <Area 
              type="monotone" 
              dataKey="predictedWasteKg" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={0.2} 
              fill="url(#colorWaste)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AiWasteChart;