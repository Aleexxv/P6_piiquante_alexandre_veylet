const express = require('express');
const router = express.Router();


const password = require('../midd/password');
const userCtrl = require('../controllers/user');

router.post('/signup', password, userCtrl.signUp);
router.post('/login', password, userCtrl.logIn);

module.exports = router;