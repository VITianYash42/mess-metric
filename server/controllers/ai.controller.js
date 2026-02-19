const axios = require('axios');

// 👇 FINAL SMART CONFIGURATION
// 1. If 'AI_ENGINE_URL' exists (Render), use it.
// 2. If not (Localhost), default to 'http://127.0.0.1:5001'.
const AI_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:5001';

exports.getPrediction = async (req, res) => {
    try {
        const { attendance, day_of_week, is_weekend, is_special_event } = req.body;

        if (!attendance) {
            return res.status(400).json({ 
                success: false, 
                message: "Attendance count is required." 
            });
        }

        const aiResponse = await axios.post(`${AI_URL}/predict`, {
            attendance,
            day_of_week,
            is_weekend,
            is_special_event
        });

        return res.status(200).json({
            success: true,
            data: aiResponse.data
        });

    } catch (error) {
        console.error(`❌ AI Prediction Error (${AI_URL}):`, error.message);
        return res.status(500).json({ success: false, message: "AI Engine is offline." });
    }
};

exports.analyzeFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;

        if (!feedback) {
            return res.status(400).json({ success: false, message: "Feedback text is required." });
        }

        console.log(`📡 Connecting to AI at: ${AI_URL}/analyze-feedback`);

        const aiResponse = await axios.post(`${AI_URL}/analyze-feedback`, {
            feedback
        });

        return res.status(200).json({
            success: true,
            data: aiResponse.data
        });

    } catch (error) {
        console.error(`❌ AI Analysis Failed (Target: ${AI_URL}):`, error.message);
        return res.status(500).json({ success: false, message: "AI Analysis Failed" });
    }
};

// -------------------------------------------------------------
// Procurement calculator (simple recipe-based math)
// -------------------------------------------------------------
exports.calculateProcurement = (req, res) => {
    try {
        const { students } = req.body;
        if (typeof students !== 'number' || students < 0) {
            return res.status(400).json({ success: false, message: 'Valid number of students required.' });
        }

        // hardcoded recipe ratios per student
        const rice = +(students * 0.15).toFixed(3);
        const dal = +(students * 0.10).toFixed(3);
        const vegetables = +(students * 0.20).toFixed(3);

        return res.status(200).json({
            success: true,
            data: { rice, dal, vegetables }
        });

    } catch (error) {
        console.error('❌ Procurement calculation error:', error);
        return res.status(500).json({ success: false, message: 'Unable to calculate procurement.' });
    }
};