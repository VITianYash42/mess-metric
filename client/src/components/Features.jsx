import {Users, Heart, Award } from "lucide-react" 
import { motion } from "motion/react";

export function Features(){
  const features = [
  {
    title: 'Live Hunger Map',
    description: 'Real-time visualization of meal demand across campus hostels to optimize food preparation',
    icon: Users,
    color: 'from-emerald-500 to-green-600',
  },
  {
    title: 'Leftover Auction',
    description: 'Emergency broadcast system to connect surplus food with NGOs and local farmers instantly',
    icon: Heart,
    color: 'from-green-500 to-lime-600',
  },
  {
    title: 'Green Champion Leaderboard',
    description: 'Gamified sustainability tracking with badges, meal coins, and semester certificates',
    icon: Award,
    color: 'from-lime-500 to-yellow-500',
  },
  ];

  return(
    <>
      <section id="features" className="bg-white/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600">Innovative solutions for sustainable campus dining</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="h-full bg-white border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-2xl group rounded-2xl">
                  <div className="pt-8 pb-8 pl-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br ${feature.color} rounded-2xl group-hover:scale-110`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 w-72">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed w-80">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}