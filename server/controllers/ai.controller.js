const axios = require('axios');

// 👇 CRITICAL FIX: Dynamically choose the URL
// If on Render, it uses the Cloud URL. If on Laptop, it uses Localhost.
const AI_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:5001';

console.log("🤖 AI Controller connecting to:", AI_URL);

// Controller to handle AI prediction requests
exports.getPrediction = async (req, res) => {
    try {
        const { attendance, day_of_week, is_weekend, is_special_event } = req.body;

        if (!attendance) {
            return res.status(400).json({ 
                success: false, 
                message: "Attendance count is required." 
            });
        }

        // Call Python AI Engine
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
        console.error(`❌ AI Prediction Error connecting to ${AI_URL}:`, error.message);
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ success: false, message: "AI Engine is offline." });
        }
        return res.status(500).json({ success: false, message: "Server Error." });
    }
};

// Controller to handle Sentiment Analysis
exports.analyzeFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;

        if (!feedback) {
            return res.status(400).json({ success: false, message: "Feedback text is required." });
        }

        // Call Python AI for Sentiment Analysis
        const aiResponse = await axios.post(`${AI_URL}/analyze-feedback`, {
            feedback
        });

        return res.status(200).json({
            success: true,
            data: aiResponse.data
        });

    } catch (error) {
        console.error(`❌ AI Analysis Error connecting to ${AI_URL}:`, error.message);
        return res.status(500).json({ success: false, message: "AI Analysis Failed" });
    }
};