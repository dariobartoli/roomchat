const mongoose = require('../config/mongo')

const userSchema = new mongoose.Schema({
    nickName: String,
    password: String,
    rooms: [{type: mongoose.Schema.Types.ObjectId, ref: "Rooms"}],
}, {timestamps: true})

userSchema.set("toJSON", {
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  });

const UserModel = mongoose.model('Users', userSchema)

module.exports = UserModel