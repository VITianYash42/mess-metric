import { Star, Lock, Clock, CheckCircle2, PartyPopper, Ban, Info, CalendarClock, Hourglass } from 'lucide-react';

export function WeeklyRewardBadge() {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  

  const isSunday = dayName === "Sunday"; 

  const hasWeeklyStreak = true;
  const currentStreakDays = 5;
  const daysUntilSunday = 7 - today.getDay();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
        <h2 className="text-xl font-bold text-slate-800">Weekly Streak Reward</h2>
      </div>

      {!isSunday && (
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <Hourglass className="w-3.5 h-3.5" />
                In Progress
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Badge Reveals on Sunday
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
                Keep marking your meals (Eat/Skip) accurately every day. 
                If you maintain your streak, you will unlock the <span className="font-bold text-amber-600">Extra Gulab Jamun</span> badge this Sunday!
              </p>
            </div>

            <div className="w-full md:w-auto min-w-[250px] bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Current Streak</span>
                <span className="text-xs font-bold text-emerald-600">{currentStreakDays}/6 Days</span>
              </div>
              
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mb-4">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${(currentStreakDays / 6) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CalendarClock className="w-4 h-4" />
                <span>Result available in {daysUntilSunday === 0 ? 'a few hours' : `${daysUntilSunday} days`}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {isSunday && hasWeeklyStreak && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border border-amber-300 shadow-xl shadow-amber-100/50">
          
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px] animate-[pulse_3s_ease-in-out_infinite]"></div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6 text-center md:text-left">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active
              </div>
              <h3 className="text-3xl font-black text-amber-900 mb-1">
                Sincere Student Badge
              </h3>
              <p className="text-amber-800/80 font-medium">
                Show this screen to the mess staff to claim your reward.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-sm flex items-center gap-4 min-w-[280px]">
              <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-3 rounded-xl text-white shadow-md">
                <PartyPopper className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase">One-Time Reward</p>
                <h4 className="text-xl font-extrabold text-slate-900 leading-tight">
                  +1 Extra Gulab Jamun
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Expires: Monday Morning
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSunday && !hasWeeklyStreak && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-slate-200 border border-slate-300 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Lock className="w-3.5 h-3.5" />
              Reward Locked
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              Standard Portion Only
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
              You did not maintain the required meal streak this week. 
              Therefore, you are <span className="font-bold text-slate-700">not eligible</span> for the extra Gulab Jamun reward today.
            </p>
            
            <div className="mt-4 flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200">
               <Info className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
               <p className="text-xs text-slate-500 text-left">
                 <strong>Tip:</strong> Mark your meals accurately (Eat/Skip) every day next week to unlock this reward next Sunday!
               </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-w-[200px] opacity-75 grayscale transition-all hover:grayscale-0">
             <div className="relative">
               <div className="bg-slate-100 p-4 rounded-full">
                 <PartyPopper className="w-8 h-8 text-slate-400" />
               </div>
               <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                  <Ban className="w-5 h-5 text-red-500" />
               </div>
             </div>
             <h4 className="mt-3 text-sm font-bold text-slate-400 uppercase">Extra Reward</h4>
             <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded mt-1">
               Not Granted
             </span>
          </div>

        </div>
      )}

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}