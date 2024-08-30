const db = require('../config/firebase');

// Create a new booking
exports.createBooking = async (req, res) => {
  const { user_id, space_id, start_time, end_time } = req.body;
  try {
    const newBooking = {
      user_id,
      space_id,
      start_time,
      end_time,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const ref = await db.collection('bookings').add(newBooking);
    res.status(201).json({ id: ref.id, ...newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve booking details
exports.getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await db.collection('bookings').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List bookings for a specific user
exports.getBookingsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const querySnapshot = await db
      .collection('bookings')
      .where('user_id', '==', userId)
      .get();
    const bookings = [];
    querySnapshot.forEach(doc => bookings.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('bookings').doc(id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
