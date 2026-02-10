import { ArrowRight, TrendingDown, Users, Leaf, Award } from 'lucide-react';
import { motion } from "motion/react"
import { Link } from 'react-router-dom';

export function Hero(){
  const stats = [
    { value: '45,892', label: 'Meals Saved', icon: TrendingDown },
    { value: '12.4 tons', label: 'CO₂ Reduced', icon: Leaf },
    { value: '8,234', label: 'Active Students', icon: Users },
    { value: '156', label: 'Green Champions', icon: Award },
  ];

  return(
    <>
      {/* 👇 Added overflow-hidden to stop horizontal scrolling issues */}
      <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-10 md:py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            {/* 👇 FIXED: text-2xl is smaller and safer for mobile phones */}
            <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight break-words">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent block">
                Transforming Campus
              </span>
              <span className="text-gray-800 block mt-2">
                Food Sustainability
              </span>
            </h1>
            
            <p className="text-sm md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto px-2">
              Smart mess management that reduces food waste, rewards eco-conscious behavior, 
              and creates a greener campus one meal at a time.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto rounded-lg p-3 bg-gradient-to-r text-white from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-base md:text-lg font-medium px-6 flex justify-center items-center shadow-lg shadow-emerald-200">
                  Student Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <Link to="/admin/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto p-2.5 bg-white rounded-lg border-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-black text-base md:text-lg font-medium px-6 transition-colors">
                  Admin/Manager Login
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
         <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="bg-white/70 backdrop-blur-sm border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-xl rounded-2xl h-full">
                <div className="py-4 md:py-6 px-2 text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full">
                    <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-xl md:text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </section>
    </>
  )
}