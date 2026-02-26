import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChefHat, 
  AlertTriangle, 
  Flame, 
  Clock, 
  Users, 
  CheckCircle2, 
  BrainCircuit, 
  TrendingDown,
  Scale
} from "lucide-react";

export function KitchenDisplayPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data representing state that would be fetched from /api/ai/predict 
  // and /api/menu/today
  const [aiInsight, setAiInsight] = useState({
    predictedWaste: "18.5",
    confidence: "94",
    recommendation: "Reduce Rice production by 15% for next batch."
  });

  const currentMeal = {
    type: "Lunch",
    menu: ["Rajma Masala", "Jeera Rice", "Mix Veg", "Chapati", "Curd"],
    servingTime: "12:30 PM - 2:30 PM"
  };

  const metrics = {
    expectedFootfall: 1200,
    currentServed: 845,
    remaining: 355,
  };

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 overflow-hidden flex flex-col">
      
      {/* BRANDED HEADER - Matches Admin Dashboard Palette */}
      <header className="flex justify-between items-center border-b border-[#1e3a8a]/40 pb-4 mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-[#1e3a8a] p-3 rounded-2xl shadow-lg shadow-blue-900/40">
            <ChefHat className="text-white w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">Kitchen Command</h1>
            <p className="text-blue-400 text-lg flex items-center gap-2">
              <BrainCircuit size={20} className="text-emerald-400" /> 
              Gemini AI Optimized Production
            </p>
          </div>
        </div>
        <div className="text-right flex items-center gap-8">
          <div className="hidden md:flex flex-col items-end">
             <span className="text-emerald-400 font-bold text-sm uppercase tracking-widest">System Status</span>
             <span className="text-white font-medium flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
               Live AI Sync
             </span>
          </div>
          <div className="text-6xl font-black tabular-nums tracking-tighter text-white">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>

      {/* MAIN KITCHEN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* LEFT: ACTIVE PRODUCTION (PRIMARY FOCUS) */}
        <div className="lg:col-span-8 bg-[#1e3a8a] rounded-[2.5rem] p-10 flex flex-col shadow-2xl relative overflow-hidden">
          {/* Subtle Branded Background Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex justify-between items-end mb-10 relative z-10">
            <div>
              <div className="flex items-center gap-3 text-blue-200 mb-2 uppercase font-black tracking-widest">
                <Flame className="text-orange-500" /> Active Session
              </div>
              <p className="text-7xl font-black text-white tracking-tighter">{currentMeal.type}</p>
            </div>
            <div className="bg-black/20 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl">
              <p className="text-xl font-bold text-blue-100 flex items-center gap-3">
                <Clock className="w-6 h-6 text-emerald-400" /> {currentMeal.servingTime}
              </p>
            </div>
          </div>

          <div className="flex-1 relative z-10 grid grid-cols-1 gap-4">
            {currentMeal.menu.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all"
              >
                <span className="text-5xl font-bold text-white tracking-tight">{item}</span>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-48 bg-black/30 rounded-full overflow-hidden hidden xl:block">
                     <div className="h-full bg-emerald-500 w-[70%]" />
                  </div>
                  <CheckCircle2 className="text-emerald-400 w-12 h-12 opacity-80" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: AI INSIGHTS & ANALYTICS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* AI PREDICTION CARD - Consistent with Admin AI Insight styles */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <BrainCircuit className="text-emerald-500 opacity-20 w-24 h-24 rotate-12" />
            </div>
            <h3 className="text-2xl font-black text-emerald-400 flex items-center gap-3 mb-6 uppercase tracking-wider">
              AI Forecast
            </h3>
            
            <div className="relative z-10">
              <div className="flex items-end gap-3 mb-6">
                <span className="text-7xl font-black text-white tracking-tighter">{aiInsight.predictedWaste}</span>
                <span className="text-2xl font-bold text-emerald-500 mb-2 uppercase">kg Waste</span>
              </div>
              
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl mb-4">
                <p className="text-xs font-black text-emerald-500 uppercase mb-2 tracking-widest">Gemini Recommendation</p>
                <p className="text-2xl font-bold text-white leading-tight">{aiInsight.recommendation}</p>
              </div>
              
              <div className="flex justify-between text-sm font-bold text-emerald-400/60 uppercase tracking-widest">
                <span>Confidence Score</span>
                <span>{aiInsight.confidence}%</span>
              </div>
            </div>
          </div>

          {/* ATTENDANCE TRACKER */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 flex-1 shadow-2xl">
            <h3 className="text-2xl font-black text-blue-400 flex items-center gap-3 mb-8 uppercase tracking-wider">
              Live Flow
            </h3>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-6 rounded-2xl">
                  <p className="text-slate-500 font-black text-xs uppercase mb-1">Expected</p>
                  <p className="text-4xl font-black text-white">{metrics.expectedFootfall}</p>
                </div>
                <div className="bg-black/20 p-6 rounded-2xl border-l-4 border-emerald-500">
                  <p className="text-slate-500 font-black text-xs uppercase mb-1">Served</p>
                  <p className="text-4xl font-black text-emerald-400">{metrics.currentServed}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3 font-black text-xs uppercase tracking-widest">
                  <span className="text-slate-500">Kitchen Capacity</span>
                  <span className="text-orange-400">{metrics.remaining} Left</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-6 p-1 border border-slate-700">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(metrics.currentServed / metrics.expectedFootfall) * 100}%` }}
                    className="h-full bg-gradient-to-r from-[#1e3a8a] to-emerald-500 rounded-full"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <TrendingDown className="text-blue-400" />
                  </div>
                  <p className="text-lg leading-snug">
                    <span className="text-white font-bold">-12% Arrival rate</span> vs typical Monday.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}