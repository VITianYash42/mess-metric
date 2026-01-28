import { ArrowRight } from 'lucide-react';

export function Hero(){
  return(
    <>
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-emerald-50">
        <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent">
                Transforming Campus
              </span>
              <br />
              <span className="text-gray-800">Food Sustainability</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Smart mess management that reduces food waste, rewards eco-conscious behavior, 
              and creates a greener campus one meal at a time.
            </p>
            <div className="flex gap-4 justify-center">
              <a to="/auth">
                <button size="lg" className="rounded-lg p-2 bg-gradient-to-r text-white from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-lg px-8 flex">
                  Student Login
                  <ArrowRight className="ml-2 mt-1 h-5 w-5" />
                </button>
              </a>
              <a to="/auth">
                <button size="lg" variant="outline" className="p-1.5 bg-white rounded-lg border-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-black text-lg px-8">
                  Admin/Manager Login
                </button>
              </a>
            </div>
        </div>
      </section>
    </>
  )
}