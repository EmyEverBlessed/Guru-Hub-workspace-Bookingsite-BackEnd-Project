const db = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: 'User', // Default role; modify if needed
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save the new user in Firestore
    const ref = await db.collection('users').add(newUser);
    res.status(201).json({ id: ref.id, ...newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Authenticate a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = snapshot.docs[0].data();

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: snapshot.docs[0].id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve user profile details
exports.getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile details
exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  updates.updated_at = new Date().toISOString();
  try {
    const userRef = db.collection('users').doc(id);
    await userRef.update(updates);
    const updatedUser = await userRef.get();
    res.status(200).json({ id: updatedUser.id, ...updatedUser.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Log out a user
exports.logoutUser = (req, res) => {
  // Invalidate the token (handled on client-side in most cases)
  res.status(200).json({ message: 'User logged out successfully' });
};
