const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const tokenAuth = require("../middlewares/tokenAuth");

router.use(tokenAuth.userVerify);
router.get('/profile', userController.profile)

module.exports = router
