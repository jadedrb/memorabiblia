const express = require('express');
const router = express.Router();

// User controller
const userController = require('../../controllers/userController');

// Newer routes (for login & auth)
router.post('/login', userController.login_post);
router.post('/signup', userController.signup_post);
router.get('/logout', userController.logout_get);
router.get('/verify', userController.verify_user_get);

router.post('/:user/settings', userController.user_update)
router.get('/:id', userController.user_get);

// Original routes (GET, POST, & DELETE USERS)
router.get('/', userController.users_get);
router.post('/', userController.user_post);
router.delete('/remove/:id', userController.user_delete)

module.exports = router;