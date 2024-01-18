const  RoomModel = require('../models/rooms')
const UserModel = require('../models/users')
const MessageModel = require('../models/messages')

const createRoom = async(req,res) => {
    try {
        const {name, password} = req.body
        const nameLower = name.toLowerCase()
        const roomTrue = await RoomModel.find({name: nameLower})
        if(roomTrue.length>0){
            return res.status(401).json({message: 'name already been use'})
        }
        const roomObject = {
            name: nameLower,
            password,
            members: req.user.id
        }
        const newRoom = new RoomModel(roomObject)
        await newRoom.save()
        const user = await UserModel.findById(req.user.id)
        user.rooms.push(newRoom._id)
        await user.save()
        return res.status(201).json({message: 'room created', newRoom})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const getAll = async(req,res) => {
    try {
        const rooms = await RoomModel.find()
        return res.status(200).json({message: 'rooms', rooms})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const getOne = async(req,res) => {
    try {
        const id = req.params.id
        // Utiliza populate para obtener información de los mensajes y usuarios al mismo tiempo
        const room = await RoomModel.findById(id).populate({
            path: 'history',
            populate:{
                path: 'user', // Nombre del campo de referencia en el modelo Message
                ref: 'Users' // Nombre del modelo al que hace referencia el campo 'user'
            }
        })
        return res.status(200).json({message: 'room', room})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const joinRoom = async(req,res) => {
    try {
        const {roomId, password} = req.body
        const userId = req.user.id
        const room = await RoomModel.findById(roomId)
        const user = await UserModel.findById(userId)
        const valor = room.members.map((item) => item.toString() === userId)
        const isInRoom = valor.includes(true)
        if(isInRoom){
            return res.status(401).json({message: 'already is in this room'})
        }
        if(password != room.password){
            return res.status(401).json({message: "password incorrect"})
        }
        room.members.push(userId)
        user.rooms.push(roomId)
        await user.save()
        await room.save()
        return res.status(200).json({message: 'join successful', room})
    } catch (error) {
        return res.status(500).json({message: error.message}) 
    }
}

module.exports = {createRoom, getAll, getOne, joinRoom}