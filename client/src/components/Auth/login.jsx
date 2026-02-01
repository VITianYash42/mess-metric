import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const port = `http://localhost:${import.meta.env.VITE_PORT || '5000'}/api/auth/login`;
      
      const response = await fetch(port, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      if (data.success) {
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Unable to connect to server. Please try again later.");
    } finally {
      setIsLoading(false);
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
    <div className="relative flex flex-col justify-center items-center h-screen bg-[#ecfdf5] overflow-hidden">
      
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#006400_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15]"></div>

      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 183, 124, 0.15), transparent 40%)`,
        }}
      ></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md border-2 border-[#2f4b69]/10 shadow-2xl p-10 rounded-3xl flex flex-col items-center"
      >
        <Link to="/">
          <ArrowLeft className="absolute left-4 top-4 text-gray-500 hover:text-[#10b77c] transition-colors"/>
        </Link>
        
        <h2 className="text-3xl font-bold mb-2 text-[#2f4b69]">Welcome Back</h2>
        <p className="text-[#10b77c] font-medium mb-8">Please enter your details</p>
        
        <div className="w-full space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="text" 
              placeholder="name@gmail.com" 
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#10b77c] transition-all bg-white/50"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // Allow Enter key to login
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
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#10b77c] transition-all bg-white/50"
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
                : "bg-[#10b77c] hover:bg-[#0b8359] hover:shadow-green-500/30"
            }`}
            onClick={handleLogin}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </motion.button>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm text-gray-500"
        >
          Don't have an account?
          <Link to="/register">
            <span className="text-[#2f4b69] font-bold ml-1 cursor-pointer hover:underline">Sign up</span>
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}