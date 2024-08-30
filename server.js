const express = require('express');
const bodyParser = require('body-parser');
const spaceRoutes = require('./routes/spaceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect space, booking, and user routes
app.use('/api/spaces', spaceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes); // Use user routes

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Coworking Space Booking API');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
