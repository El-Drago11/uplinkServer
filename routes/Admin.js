const express = require('express');
const { isAdmin, auth } = require('../middleware/auth');
const { getAllRegisterUserDetail } = require('../controller/Admin');
const router = express.Router();

router.get("/getAllPlayer",auth,isAdmin,getAllRegisterUserDetail)

module.exports = router

