import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Mail, Hash, Building2, Coins, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { StudentDashboardNavBar } from "./StudentDashboard/StudentDashboardNavBar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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

export function StudentProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const profileFields = [
    {
      icon: User,
      label: "Name",
      value: user.name || "Not provided",
      color: "text-emerald-600"
    },
    {
      icon: Mail,
      label: "Email",
      value: user.email || "Not provided",
      color: "text-blue-600"
    },
    {
      icon: Hash,
      label: "Registration Number",
      value: user.registrationNo || "Not provided",
      color: "text-purple-600"
    },
    {
      icon: Building2,
      label: "Mess Name",
      value: user.messName || "Not provided",
      color: "text-orange-600"
    },
    {
      icon: Coins,
      label: "Meal Coins",
      value: user.mealCoins || 0,
      color: "text-amber-600"
    }
  ];

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
        className="pt-6 px-4 md:px-6 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <Link 
            to="/student/dashboard"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
                <span className="text-3xl md:text-4xl font-bold text-white">
                  {user.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {user.name || "User"}
                </h1>
                <p className="text-emerald-50 text-sm md:text-base">
                  {user.registrationNo || "No registration number"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Information</h2>
            <div className="space-y-4">
              {profileFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                  >
                    <div className={`p-2 rounded-lg bg-white shadow-sm ${field.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                        {field.label}
                      </p>
                      <p className="text-base md:text-lg font-semibold text-slate-800 break-words">
                        {field.value}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
