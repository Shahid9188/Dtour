const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');
const { protect } = require('../middleware/auth');

router.get('/trip/:tripId', protect, itineraryController.getTripItinerary);

router.route('/:id')
    .get(protect, itineraryController.getItineraryDay)
    .put(protect, itineraryController.updateItineraryDay);

router.post('/:id/activity', protect, itineraryController.addActivity);
router.delete('/:id/activity/:actId', protect, itineraryController.deleteActivity);
router.put('/:id/activity/:actId/complete', protect, itineraryController.toggleComplete);

module.exports = router;
