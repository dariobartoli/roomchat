const mongoose = require('../config/mongo')

const roomSchema = new mongoose.Schema({
    name: String,
    password: String,
    members: [{type: mongoose.Schema.Types.ObjectId, ref: "Users"}],
    history: [{type: mongoose.Schema.Types.ObjectId, ref: "Messages"}],
})

const RoomModel = mongoose.model('Rooms', roomSchema)

module.exports = RoomModel