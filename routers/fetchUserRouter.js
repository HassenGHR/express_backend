const express = require('express');
const fetchUser = require('../controllers/generateToken');

const router = express.Router();

router.get('/user-info', fetchUser.fetchUserInfo);


module.exports = router;
