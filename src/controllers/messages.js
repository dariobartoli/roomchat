const MessageModel = require('../models/messages')
const  RoomModel = require('../models/rooms')
const UserModel = require('../models/users')

const handleMessage = async(req,res) => {
    try {
        const io = req.app.get('socketio'); // Obtiene la instancia de io desde la aplicación
        const userId= req.user.id
        const {message, roomId} = req.body
        const room = await RoomModel.findById(roomId)
        const user = await UserModel.findById(userId)
        const senderName = user.nickName
        if(room.length == 0){
            return res.status(403).json({message: "No existe esta sala"})
        }
        if(message.length == 0){
            return res.status(403).json({message: "Mensaje vacio"})
        }
        let newMessage = new MessageModel({message, roomId, user: req.user.id})
        room.history.push(newMessage._id)
        await newMessage.save()
        await room.save()
        io.emit(room.name, {message, senderName});
        return res.status(201).json({ message: 'Message send successfully', newMessage });
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}

module.exports = { handleMessage};