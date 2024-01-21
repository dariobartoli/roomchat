const UserModel = require('../models/users')
const jwt = require("jsonwebtoken")
require('dotenv').config();

const register = async(req,res) => {
    try {
        let {nickName, password} = req.body
        let nickNameTrue = await UserModel.find({nickName: nickName})
        if(nickNameTrue.length > 0){
          return res.status(409).json({message: "Este nickname no está disponible"})
        }
        if(nickName.length == 0){
            return res.status(401).json({message: "Nickname vacio"})
        }
        if(password.length == 0){
            return res.status(401).json({message: "Contraseña vacia"})
        }
        let newUser = new UserModel({nickName, password})
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
        const user = await UserModel.findOne({nickName: nickName}).select('_id nickName password')
        if(user == null) return res.status(401).json({ message: "No existe el usuario"});
        if(user.password != password){
            return res.status(403).json({message: "Contraseña incorrecta"})
        }
        const token = jwt.sign(
            { nickName: user.nickName, id: user._id},
            process.env.TOKEN_SIGNATURE, {expiresIn: '60m'})
        return res.status(201).json({message: 'Ingreso exitoso', token, userId: user._id})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


module.exports = {register, login}