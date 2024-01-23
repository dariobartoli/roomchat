const mongoose = require("../config/mongo");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    nickName: String,
    password: String,
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rooms" }],
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); //this.password, la contraseña guardada en el objeto
};

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
