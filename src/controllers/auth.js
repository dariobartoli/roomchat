const UserModel = require('../models/users')
const jwt = require("jsonwebtoken")
require('dotenv').config();

const register = async(req,res) => {
    try {
        let {nickName, password} = req.body
        let nickNameTrue = await UserModel.find({nickName: nickName})
        if(nickNameTrue.length > 0){
          return res.status(409).json({message: "this nickname is unavailable"})
        }
        let newUser = new UserModel({nickName, password})
        const user = await newUser.save()
        const sanitizedUser = { ...user._doc };
        delete sanitizedUser.password;
        return res.status(201).json({ message:"successful registration" , sanitizedUser}); 
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const login = async(req,res) => {
    try {
        let {nickName, password} = req.body
        const user = await UserModel.findOne({nickName: nickName}).select('_id nickName password')
        if(user == null) return res.status(401).json({ message: "user doesn't exist"});
        if(user.password != password){
            return res.status(403).json({message: "password incorrect"})
        }
        const token = jwt.sign(
            { nickName: user.nickName, id: user._id},
            process.env.TOKEN_SIGNATURE, {expiresIn: '60m'})
        return res.status(201).json({message: 'login successful', token, userId: user._id})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


module.exports = {register, login}