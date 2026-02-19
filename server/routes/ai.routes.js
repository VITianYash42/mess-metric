const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// Route: POST /api/ai/predict (For Waste Graph)
router.post('/predict', aiController.getPrediction);

// Route: POST /api/ai/analyze (For Feedback Box)
router.post('/analyze', aiController.analyzeFeedback);

// Route: POST /api/ai/procurement
// Accepts { students: number } and returns ingredient quantities
router.post('/procurement', aiController.calculateProcurement);

module.exports = router;