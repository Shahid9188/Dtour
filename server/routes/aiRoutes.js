const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.get('/quiz-questions', aiController.getQuizQuestions); // Public

router.post('/generate-itinerary/:tripId', protect, aiController.generateItinerary);
router.post('/replan/:itineraryId', protect, aiController.replanDay);
router.post('/chat/:tripId', protect, aiController.chat);
router.get('/budget-optimize/:tripId', protect, aiController.getBudgetOptimization);

module.exports = router;
