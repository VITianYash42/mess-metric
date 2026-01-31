import { useState, useEffect } from "react";
import { motion } from "motion/react"; 
import { Link } from 'react-router-dom';

export function Login() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async() => {
    try{
      const port = `http://localhost:${import.meta.env.PORT || '5000'}/api/auth/login`;
      const response = await fetch(`${port}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json();

      if(!response.ok){
        alert("login failed");
        return;
      }
      if(data.success){
        alert("login successfully");
        return;
      }
    }catch(error){
      console.error("Error:", error);
      alert("Something went wrong connecting to the server.");
    }
  }

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md border-2 border-[#2f4b69]/10 shadow-2xl p-10 rounded-3xl flex flex-col items-center"
      >
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
            />
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-[#10b77c] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-[#0b8359] hover:shadow-green-500/30 transition-all"
            onClick={handleLogin}
          >
            Sign In
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