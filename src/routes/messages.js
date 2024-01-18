const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messages')
const tokenAuth = require("../middlewares/tokenAuth");



router.use(tokenAuth.userVerify);
router.post('/', messageController.handleMessage)

module.exports = router