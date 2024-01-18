const mongoose = require('../config/mongo')

const messageSchema = new mongoose.Schema({
    message: String,
    roomId: String,
    user: [{type: mongoose.Schema.Types.ObjectId, ref: "Users"}],
  }, {timestamps: true});
  
const MessageModel = mongoose.model('Messages', messageSchema);

module.exports = MessageModel