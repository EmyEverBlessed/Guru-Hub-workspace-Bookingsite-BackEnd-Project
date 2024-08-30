const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spaceController');

// Route to get all spaces
router.get('/', spaceController.getAllSpaces);

// Route to get a space by ID
router.get('/:id', spaceController.getSpaceById);

// Route to add a new space (admin only)
router.post('/', spaceController.addSpace);

// Route to update a space by ID (admin only)
router.put('/:id', spaceController.updateSpace);

// Route to delete a space by ID (admin only)
router.delete('/:id', spaceController.deleteSpace);

module.exports = router;
