import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Components
import { StudentDashboardNavBar } from "./StudentDashboard/StudentDashboardNavBar";
import { DailyMealTracker } from "./StudentDashboard/DailyMealTracker";
import { StatsOverview } from "./StudentDashboard/StatsOverview";
import { CoinRedemptionCard } from "./StudentDashboard/CoinRedemptionCard";
import { WeeklyRewardBadge } from "./StudentDashboard/WeeklyRewardBadge";
import { DailyFoodReview } from "./StudentDashboard/DailyFoodReview";
import AiWasteChart from './AiWasteChart'; 

// ❌ DELETED: import AiFeedbackWidget from './AiFeedbackWidget'; (No longer needed)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export function StudentDashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50"
      >
        <StudentDashboardNavBar user={user} />
      </motion.div>

      <motion.main
        className="pt-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <DailyMealTracker user={user} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsOverview user={user} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <CoinRedemptionCard user={user} />
        </motion.div>

        {/* 👇 UPDATED: Graph is now full width again, Feedback box is gone */}
        <motion.div variants={itemVariants} className="px-4 md:px-6 mb-8">
           <AiWasteChart />
        </motion.div>

        <motion.div variants={itemVariants}>
          <WeeklyRewardBadge  />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DailyFoodReview />
        </motion.div>
      </motion.main>
    </div>
  );
}