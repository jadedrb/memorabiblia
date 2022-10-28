const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/middleware')

// Memory controller
const memoryController = require('../../controllers/memoryController');

// Memory routes
router.get('/:user', requireAuth, memoryController.memories_get);
router.get('/:user/words', requireAuth, memoryController.memories_words);
router.post('/', requireAuth, memoryController.memory_post);
router.post('/update/:id', requireAuth, memoryController.memory_update)
router.delete('/remove/:id', requireAuth, memoryController.memory_delete)

module.exports = router;