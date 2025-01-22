const express = require('express');
const { login, signUp } = require('../controller/Auth');
const router = express.Router();


router.post('/signup',signUp)
router.post('/login',login);

module.exports = router