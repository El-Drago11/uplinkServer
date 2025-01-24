const express = require('express');
const { isAdmin, auth } = require('../middleware/auth');
const { getAllRegisterUserDetail, updateUserStatus } = require('../controller/Admin');
const router = express.Router();

router.get("/getAllPlayer",auth,isAdmin,getAllRegisterUserDetail)
router.put("/updateUserStatus",auth,isAdmin,updateUserStatus)

module.exports = router

