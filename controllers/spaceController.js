const db = require('../config/firebase');

// Get all spaces
exports.getAllSpaces = async (req, res) => {
  try {
    let query = db.collection('spaces');

    // Apply filters if provided
    if (req.query.location) {
      query = query.where('location', '==', req.query.location);
    }
    if (req.query.min_price && req.query.max_price) {
      query = query.where('price_per_hour', '>=', parseFloat(req.query.min_price))
                   .where('price_per_hour', '<=', parseFloat(req.query.max_price));
    }

    const snapshot = await query.get();
    const spaces = [];
    snapshot.forEach(doc => {
      spaces.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(spaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single space by ID
exports.getSpaceById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await db.collection('spaces').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new space
exports.addSpace = async (req, res) => {
  const { name, location, description, price_per_hour, available_from, available_to } = req.body;
  try {
    const newSpace = {
      name,
      location,
      description,
      price_per_hour,
      available_from,
      available_to,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const ref = await db.collection('spaces').add(newSpace);
    res.status(201).json({ id: ref.id, ...newSpace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing space
exports.updateSpace = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  updates.updated_at = new Date().toISOString();
  try {
    const spaceRef = db.collection('spaces').doc(id);
    await spaceRef.update(updates);
    const updatedSpace = await spaceRef.get();
    res.status(200).json({ id: updatedSpace.id, ...updatedSpace.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a space
exports.deleteSpace = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('spaces').doc(id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
