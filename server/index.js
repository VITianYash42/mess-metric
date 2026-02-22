const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/auth.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const aiRoutes = require("./routes/ai.routes");
const reportRoutes = require("./routes/report.routes");
const connectDB = require("./config/db");

const app = express();

// ==========================================
// 1. CORS CONFIGURATION
// ==========================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mess-metric.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ==========================================
// 2. MIDDLEWARE
// ==========================================
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
  next();
});

// ==========================================
// 3. DATABASE CONNECTION
// ==========================================
connectDB().catch(err => {
  console.error("❌ Database connection failed:", err);
  process.exit(1);
});

// ==========================================
// 4. ROUTES
// ==========================================
app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully 🚀", timestamp: new Date().toISOString() });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);

// 👇 THIS WAS MISSING! ADD THIS LINE:
app.use("/api/food-reviews", require("./routes/foodReview.routes")); 
// also expose same router at /api/reviews for admin list-fetching
app.use("/api/reviews", require("./routes/foodReview.routes"));

app.use("/api/admin/auth", require("./routes/admin.auth.routes"));
app.use("/api/attendance", require("./routes/attendance.routes"));
app.use("/api/menu", require("./routes/menu.routes"));

// Error Handling
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ==========================================
// 5. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Allowed Origins:`, allowedOrigins);
});