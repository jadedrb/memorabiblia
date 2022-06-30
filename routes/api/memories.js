const express = require('express');
const router = express.Router();
const { checkUser } = require('../../middleware/userMiddleware')

// Memory controller
const memoryController = require('../../controllers/memoryController');

// Memory routes
router.get('/:user', checkUser, memoryController.memories_get);
router.get('/:user/words', checkUser, memoryController.memories_words);
router.post('/', checkUser, memoryController.memory_post);
router.post('/update/:id', checkUser, memoryController.memory_update)
router.delete('/remove/:id', checkUser, memoryController.memory_delete)

module.exports = router;