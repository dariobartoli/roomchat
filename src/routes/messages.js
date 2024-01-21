const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messages')
const messageMiddleware = require('../middlewares/messages')
const tokenAuth = require("../middlewares/tokenAuth");



router.use(tokenAuth.userVerify);
router.post('/', messageController.handleMessage)

module.exports = router