import { useEffect, useState } from 'react';
import { Trophy, UtensilsCrossed, TrendingUp, Coins, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

export function StatsOverview() {
  const stats = {
    mealsSkipped: 7,
    totalMeals: 60,
    coinsSaved: 350,
    rank: 12,
    topPercent: 5
  };

  const animatedSkipped = useCounter(stats.mealsSkipped);
  const animatedRank = useCounter(stats.rank);
  const animatedCoins = useCounter(stats.coinsSaved);

  const progressWidth = Math.min((stats.mealsSkipped / 20) * 100, 100); 

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        Monthly Overview <TrendingUp className="w-5 h-5 text-emerald-500" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="group bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-100/50 text-emerald-600 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full text-amber-700 font-bold text-xs">
                <Coins className="w-3.5 h-3.5" />
                <span>+{animatedCoins} Saved</span>
              </div>
            </div>

            <div>
              <p className="text-slate-500 font-medium text-sm">Meals Skipped This Month</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-5xl font-extrabold text-slate-800 tracking-tight">
                  {animatedSkipped}
                </h3>
                <span className="text-slate-400 font-medium text-lg">/ {stats.totalMeals}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Monthly Goal</span>
                <span className="text-emerald-600">{Math.round(progressWidth)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progressWidth}%` }}
                >
                  <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500" />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl group-hover:rotate-6 transition-transform duration-300">
                <Trophy className="w-8 h-8" />
              </div>
              <Link to="/leaderboard">
                <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm font-bold transition-colors">
                  View All <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="mt-4">
              <p className="text-slate-500 font-medium text-sm">Current Leaderboard Rank</p>
              <div className="flex items-center gap-4 mt-1">
                <h3 className="text-5xl font-extrabold text-slate-800 tracking-tight">
                  #{animatedRank}
                </h3>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-1 inline-block w-fit">
                    Top {stats.topPercent}%
                  </span>
                  <span className="text-xs text-slate-400">of 1200 students</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50">
               <p className="text-sm text-slate-500 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                 Keep it up! You're closer to the top 10.
               </p>
            </div>
          </div>
        </div>

      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}