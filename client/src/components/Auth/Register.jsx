import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister= async() => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if(confirmPassword != password){
      alert('Passoword Mismatch');
      return;
    }
    try{

      const port = `http://localhost:${import.meta.env.PORT || '5000'}/api/auth/register`;
      const response = await fetch(`${port}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, email, password }),
      })

      const data = await response.json();

      if(!response.ok){
        alert("Registeration failed");
        return;
      }
      if(data.success){
        alert("Registeration successfully");
        return;
      }
    }catch(error){
      console.error("Error:", error);
      alert("Something went wrong connecting to the server.");
    }
  }


  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-[#ecfdf5] p-5 overflow-hidden">
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
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#2f4b69]">Create Account</h2>
          <p className="text-[#10b77c] font-medium">Join us today!</p>
        </motion.div>

        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#10b77c] transition-all"
              onChange={(e) => setName(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@gmail.com"
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#10b77c] transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#10b77c] transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#10b77c] transition-all"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </motion.div>
          </div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: "#0b8359" }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-[#10b77c] text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-colors"
            onClick={handleRegister}
          >
            Create Account
          </motion.button>
        </div>

        <motion.p
          variants={itemVariants}
          className="mt-8 text-center text-sm text-gray-500"
        >
          Already have an account?
          <Link to="/login">
            <span className="text-[#2f4b69] font-bold ml-1 cursor-pointer hover:underline">
              Login here
            </span>
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
