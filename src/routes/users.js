const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const tokenAuth = require("../middlewares/tokenAuth");

router.use(tokenAuth.userVerify);
router.get('/profile', userController.profile)
router.get('/:id', userController.userData)

module.exports = router
