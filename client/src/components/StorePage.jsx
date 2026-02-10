import { ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function StorePage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
          <div className="relative bg-white/50 backdrop-blur-sm border border-emerald-100 p-6 rounded-3xl shadow-xl shadow-emerald-500/10">
            <ShoppingBag className="w-16 h-16 text-emerald-600" />
            
            <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
              <Sparkles className="w-3 h-3" />
              Coming Soon
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Mess Store</span> is Opening Soon!
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
            We are currently stocking the digital shelves with snacks, rebates, and special treats. 
            Keep saving your <span className="font-semibold text-amber-600">Meal Coins</span> — you'll need them!
          </p>
        </div>

        <div className="pt-4">
          <Link 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </Link>
        </div>

      </div>
    </div>
  );
}