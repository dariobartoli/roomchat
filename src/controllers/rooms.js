const  RoomModel = require('../models/rooms')
const UserModel = require('../models/users')
const MessageModel = require('../models/messages')

const createRoom = async(req,res) => {
    try {
        const {name, password} = req.body
        const nameLower = name.toLowerCase()
        const roomTrue = await RoomModel.find({name: nameLower})
        if(roomTrue.length>0){
            return res.status(401).json({message: 'Este nombre de sala ya existe'})
        }
        if(name.length > 15){
            return res.status(401).json({message: 'Excede el limite de caracteres: 15'})
        }
        const roomObject = {
            name: nameLower,
            password,
            members: req.user.id,
            admin: req.user.id
        }
        const newRoom = new RoomModel(roomObject)
        await newRoom.save()
        const user = await UserModel.findById(req.user.id)
        user.rooms.push(newRoom._id)
        await user.save()
        return res.status(201).json({message: 'Sala creada', newRoom})
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
            return res.status(401).json({message: 'Ya estás en esta sala'})
        }
        if(password == undefined && room.password == undefined){
            room.members.push(userId)
            user.rooms.push(roomId)
            await user.save()
            await room.save()
            return res.status(200).json({message: 'Ingreso exitoso'})
        }
        if(password == undefined){
            return res.status(401).json({message: "Contraseña vacia"})
        }
        if(password != room.password){
            return res.status(401).json({message: "Contraseña incorrecta"})
        }
        room.members.push(userId)
        user.rooms.push(roomId)
        await user.save()
        await room.save()
        return res.status(200).json({message: 'Ingreso exitoso', room})
    } catch (error) {
        return res.status(500).json({message: error.message}) 
    }
}


const deleteRoom = async(req,res) => {
    try {
        const id = req.params.id
        const userId = req.user.id
        const room = await RoomModel.findById(id);
        if(room.admin != userId){
            return res.status(403).json({message:'No posee permisos para eliminar esta sala'})
        }
        await RoomModel.findByIdAndDelete(id)
        return res.status(200).json({message: "Sala eliminada"})
    } catch (error) {
        return res.status(500).json({message: error.message}) 
    }
}

const leaveRoom = async(req,res) => {
    try {
        const id = req.body.id
        const userId = req.user.id
        const room = await RoomModel.findById(id);
        const user = await UserModel.findById(userId)
        const inRoom = room.members.filter(item => item.toString() == userId)
        if(inRoom.length == 0){
            throw new Error('No perteneces a esta sala')
        }
        const filterRoom = room.members.filter(item => item.toString() != userId)
        room.members = filterRoom
        await room.save()
        const filterUserRoom = user.rooms.filter(item => item.toString() != id)
        user.rooms = filterUserRoom
        await user.save()
        return res.status(200).json({message: "Saliste de la sala"})
    } catch (error) {
        return res.status(500).json({message: error.message}) 
    }
}


module.exports = {createRoom, getAll, getOne, joinRoom, deleteRoom, leaveRoom}