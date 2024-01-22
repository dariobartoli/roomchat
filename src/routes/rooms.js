const express = require('express')
const router = express.Router()
const roomController = require('../controllers/rooms')
const tokenAuth = require("../middlewares/tokenAuth");

router.get('/', roomController.getAll)


router.use(tokenAuth.userVerify);
router.get('/:id', roomController.getOne)
router.post('/', roomController.createRoom)
router.post('/join', roomController.joinRoom)
router.delete('/:id', roomController.deleteRoom)
router.put('/', roomController.leaveRoom)

module.exports = router