import { useState, useEffect } from 'react';
import { Coins, ShoppingBag, ArrowRight, Sparkles, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const useCounter = (end, duration = 1500) => {
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

export function CoinRedemptionCard() {
  const walletData = {
    coins: 245,
    expiringSoon: 0,
  };

  const animatedCoins = useCounter(walletData.coins);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-200/50">
        
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-8">
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="p-1.5 bg-amber-500/20 rounded-lg border border-amber-500/30">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">Mess Rewards Program</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-2">Your Coin Wallet</h2>
            <p className="text-slate-400 text-sm md:text-base max-w-md">
              Earn coins by skipping meals you don't eat. Redeem them for snacks, rebates, or special treats in the campus store.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm min-w-[200px] transform hover:scale-105 transition-transform duration-300">
            <div className="bg-amber-100 p-3 rounded-full mb-3 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              <Coins className="w-8 h-8 text-amber-600 fill-amber-600" />
            </div>
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 tracking-tight">
              {animatedCoins}
            </div>
            <span className="text-slate-400 text-xs font-medium mt-1">Total Balance</span>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Link 
              to="/store"
              className="group relative flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold transition-all hover:bg-emerald-50 hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-600 group-hover:animate-bounce" />
              <span>Redeem Now</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                New Items!
              </span>
            </Link>

            <button className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
              <Gift className="w-3 h-3" />
              View Redemption History
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}