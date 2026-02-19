const WasteLog = require('../models/WasteLog');

exports.monthlyReport = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const logs = await WasteLog.find({ createdAt: { $gte: thirtyDaysAgo } }).sort({ createdAt: 1 });

    // build CSV string
    const rows = logs.map(l => `${l.createdAt.toISOString()},${l.wasteKg}`);
    const csv = ['timestamp,waste_kg', ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="monthly_waste_report.csv"');
    return res.send(csv);
  } catch (err) {
    console.error('❌ Report generation error:', err);
    return res.status(500).json({ success: false, message: 'Could not generate report.' });
  }
};