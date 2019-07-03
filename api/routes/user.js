const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user');

router.post('/signup', UserController.create_user);

router.post('/login', UserController.login_user);

router.get('/allUsers', UserController.get_all_users);

router.delete('/:userID', checkAuth, UserController.delete_user);

module.exports = router;
