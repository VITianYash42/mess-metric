import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react";

export function AdminRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messName, setMessName] = useState("");
  
  const [error, setError] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  // Standard email regex for admins
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  const handleRegister = async () => {
    setError("");
    
    if (!name || !email || !password || !confirmPassword || !messName) {
      setError("Please fill in all fields");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters, include a letter and a number.");
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mess-metric-api.onrender.com';
      const port = `${API_URL}/api/admin/auth/register`;
      
      const response = await fetch(port, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, messName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      if (data.success) {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Server connection failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    // 👇 Updated background color to #dbeafe
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-[#dbeafe] p-5 overflow-hidden">
      
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.1]"></div>
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(30, 58, 138, 0.1), transparent 40%)`,
        }}
      ></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md border-2 border-[#1e3a8a]/10 shadow-2xl p-10 rounded-3xl flex flex-col items-center"
      >
        <Link to="/">
          <ArrowLeft className="absolute left-4 top-4 text-gray-500 hover:text-[#1e3a8a] transition-colors" />
        </Link>
        
        <div className="mb-4 bg-blue-100 p-3 rounded-full text-[#1e3a8a]">
            <ShieldCheck size={32} />
        </div>

        <motion.div variants={itemVariants} className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#2f4b69]">Admin Registration</h2>
          <p className="text-[#1e3a8a] font-medium">Manage your mess efficiently</p>
        </motion.div>

        <div className="w-full space-y-4">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Admin Name"
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-all bg-white/50"
              onChange={(e) => setName(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="admin@mess.com"
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-all bg-white/50"
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Mess to Manage
            </label>
            <div className="relative">
              <select
                value={messName}
                onChange={(e) => setMessName(e.target.value)}
                className="w-full p-3 border-2 border-gray-100 rounded-xl appearance-none bg-white/50 focus:outline-none focus:border-[#1e3a8a] transition-all text-gray-700"
              >
                <option value="" disabled>Choose an option</option>
                <option value="Ab Dakshin">AB Dakshin</option>
                <option value="JMB">JMB</option>
                <option value="Mayuri">Mayuri</option>
                <option value="Rassencse">Rassencse</option>
                <option value="Safal">Safal</option>
              </select>

              {/* Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-all bg-white/50"
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-all bg-white/50"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </motion.div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className={`w-full mt-2 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#1e3a8a] hover:bg-[#172554] hover:shadow-blue-500/30"
            }`}
            onClick={handleRegister}
          >
            {isLoading ? "Creating..." : "Create Admin Account"}
          </motion.button>
        </div>

        <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-gray-500">
          Already have an admin account?
          <Link to="/admin/login">
            <span className="text-[#2f4b69] font-bold ml-1 cursor-pointer hover:underline">
              Login here
            </span>
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}