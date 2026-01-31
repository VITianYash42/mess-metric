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
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-emerald-50">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

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
              <Link to="/login">
                <button size="lg" className="rounded-lg p-2 bg-gradient-to-r text-white from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-lg px-8 flex">
                  Student Login
                  <ArrowRight className="ml-2 mt-1 h-5 w-5" />
                </button>
              </Link>
              <Link to="/login">
                <button size="lg" variant="outline" className="p-1.5 bg-white rounded-lg border-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-black text-lg px-8">
                  Admin/Manager Login
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

         <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="bg-white/70 backdrop-blur-sm border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-xl rounded-2xl">
                <div className="pt-6 pb-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </section>
    </>
  )
}