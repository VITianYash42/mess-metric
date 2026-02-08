const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const aiRoutes = require("./routes/ai.routes");
// database
const connectDB = require("./config/db");




const app = express();

// For connecting admin
app.use("/api/admin/auth", require("./routes/admin.auth.routes"));

// middleware
app.use(cors({
  origin: "http://localhost:5173", // Your Vite frontend URL
  credentials: true
}));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connect to database
connectDB().catch(err => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);

// attendance routes
const attendanceRoutes = require("./routes/attendance.routes");
app.use("/api/attendance", attendanceRoutes);

// test route
app.get("/", (req, res) => {
  res.json({ 
    message: "Backend running successfully 🚀",
    timestamp: new Date().toISOString()
  });
});

// menu routes (serves weekly/today menu for user dashboard)
const menuRoutes = require("./routes/menu.routes");
app.use("/api/menu", menuRoutes);


// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Backend URL: http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL: http://localhost:5173`);
});