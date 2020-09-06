const express = require('express');
const router = express.Router();

// Memory controller
const memoryController = require('../../controllers/memoryController');

// Memory routes
router.get('/:user', memoryController.memories_get);
router.post('/', memoryController.memory_post);
router.post('/update/:id', memoryController.memory_update)
router.delete('/remove/:id', memoryController.memory_delete)

module.exports = router;