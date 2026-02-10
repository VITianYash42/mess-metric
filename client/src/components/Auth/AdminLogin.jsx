import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react";

export function AdminLogin() {
  const navigate = useNavigate();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const fillDemoCredentials = () => {
    setIdentifier("mayuri@vitbhopal.ac.in");
    setPassword("mayuri123");
    setError(""); // Clear any previous errors
  };

  const handleLogin = async () => {
    setError("");
    
    if (!identifier || !password) {
      setError("Please enter both Admin ID/Email and password");
      return;
    }
    
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mess-metric-api.onrender.com';
      const port = `${API_URL}/api/admin/auth/login`;
      
      console.log("Attempting admin login...");
      const response = await fetch(port, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          identifier: identifier.trim(), 
          password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      if (data.success) {
        localStorage.setItem('token', data.token); 
        localStorage.setItem('admin', JSON.stringify(data.admin));
        
        console.log("Admin login successful, navigating to dashboard");
        navigate('/admin/dashboard');
      } else {
        setError(data.message || "Login failed");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to server. Please check if backend is running.");
    } finally {
      if (error) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    // 👇 Updated background color to #dbeafe
    <div className="relative flex flex-col justify-center items-center h-screen bg-[#dbeafe] overflow-hidden">
      
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
          <ArrowLeft className="absolute left-4 top-4 text-gray-500 hover:text-[#1e3a8a] transition-colors"/>
        </Link>
        
        <div className="mb-4 bg-blue-100 p-3 rounded-full text-[#1e3a8a]">
            <ShieldCheck size={32} />
        </div>

        <h2 className="text-3xl font-bold mb-2 text-[#2f4b69]">Admin Portal</h2>
        <p className="text-[#1e3a8a] font-medium mb-8">Manage your mess metrics</p>
        
        <div className="w-full space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID or Email</label>
            <input 
              type="text" 
              placeholder="admin@mess.com" 
              value={identifier}
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-all bg-white/50"
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-all bg-white/50"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 w-full"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className={`w-full mt-6 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#1e3a8a] hover:bg-[#172554] hover:shadow-blue-500/30"
            }`}
            onClick={handleLogin}
          >
            {isLoading ? "Verifying..." : "Access Dashboard"}
          </motion.button>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm text-gray-500"
        >
          Don't have an admin account?
          <Link to="/admin/register">
            <span className="text-[#1e3a8a] font-bold ml-1 cursor-pointer hover:underline">Sign up</span>
          </Link>
        </motion.p>

        <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={fillDemoCredentials}
            className="mt-8 text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] hover:text-emerald-600 transition-colors uppercase select-none"
        >
            Activate Demo Credentials
        </motion.button>
        
      </motion.div>
    </div>
  );
}