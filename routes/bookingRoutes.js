const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Route to create a new booking
router.post('/', bookingController.createBooking);

// Route to retrieve booking details
router.get('/:id', bookingController.getBookingById);

// Route to list bookings for a specific user
router.get('/user/:userId', bookingController.getBookingsByUser);

// Route to cancel a booking
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;
