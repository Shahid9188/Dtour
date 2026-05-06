const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

router.route('/')
    .post(protect, tripController.createTrip)
    .get(protect, tripController.getMyTrips);

router.route('/:id')
    .get(protect, tripController.getTrip)
    .put(protect, tripController.updateTrip)
    .delete(protect, tripController.deleteTrip);

router.post('/:id/invite', protect, tripController.inviteMember);
router.put('/invite/:token', protect, tripController.respondToInvite);
router.delete('/:id/members/:memberId', protect, tripController.removeMember);

module.exports = router;
