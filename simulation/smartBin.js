/**
 * Fake Smart Bin simulator
 * - connects to the project's MongoDB
 * - every 5 seconds generates a random waste value (~0.5kg ±0.05)
 * - inserts a WasteLog document so frontend graphs can move live during demo
 *
 * Usage: node simulation/smartBin.js
 */

const connectDB = require('../server/config/db');
const WasteLog = require('../server/models/WasteLog');

(async () => {
  try {
    await connectDB();
    console.log('🧪 Smart bin simulator connected to MongoDB');

    setInterval(async () => {
      const variation = (Math.random() - 0.5) * 0.1; // ±0.05
      const wasteKg = +(0.5 + variation).toFixed(3);
      const entry = new WasteLog({ wasteKg });

      await entry.save();
      console.log(`📦 logged ${wasteKg}kg at ${new Date().toISOString()}`);
    }, 5000);
  } catch (err) {
    console.error('Failed to start smart bin simulator:', err);
    process.exit(1);
  }
})();