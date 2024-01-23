const UserModel = require('../models/users')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require('dotenv').config();

const register = async(req,res) => {
    try {
        let {nickName, password} = req.body
        const nickLower = nickName.toLowerCase()
        let nickNameTrue = await UserModel.find({nickName: nickLower})
        let passwordHashed = await bcrypt.hash(password, 10)
        if(nickNameTrue.length > 0){
          return res.status(409).json({message: "Nickname no disponible"})
        }
        if(nickName.length == 0){
            return res.status(401).json({message: "Nickname vacio"})
        }
        if(password.length == 0){
            return res.status(401).json({message: "Contraseña vacia"})
        }
        let newUser = new UserModel({nickName: nickLower, password: passwordHashed})
        const user = await newUser.save()
        const sanitizedUser = { ...user._doc };
        delete sanitizedUser.password;
        return res.status(201).json({ message:"Registro exitoso" , sanitizedUser}); 
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const login = async(req,res) => {
    try {
        let {nickName, password} = req.body
        const nickLower = nickName.toLowerCase()
        const user = await UserModel.findOne({nickName: nickLower}).select('_id nickName password')
        if(user == null) return res.status(401).json({ message: "Usuario o contraseña incorrecta"});
        let logged = await user.comparePassword(password)
        if(!logged) return res.status(401).json({ message: "password incorrect"});
        const token = jwt.sign(
            { nickName: user.nickName, id: user._id},
            process.env.TOKEN_SIGNATURE, {expiresIn: '60min'})
        return res.status(201).json({message: 'Ingreso exitoso', token, userId: user._id})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


module.exports = {register, login}