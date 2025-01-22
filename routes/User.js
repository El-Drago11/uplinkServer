const express = require('express');
const { login, signUp } = require('../controller/Auth');
const router = express.Router();


router.post('/singup',signUp)
router.post('/login',login);

module.exports = router