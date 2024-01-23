const express = require('express')
const app = express()
app.use(express.json());
require("dotenv").config()

const cors = require('cors');
app.use(cors());


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/client/index.html') // CWD current working directory, es la ruta de donde estás parado
})

const socketIO = require('socket.io');
const http = require('http'); 

const server = http.createServer(app)
const io = new socketIO.Server(server, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
    })
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    })
})
app.set('socketio', io);
const messagesRouter = require('./routes/messages');
const authRouter = require('./routes/auth');
const roomRouter = require('./routes/rooms');
const userRouter = require('./routes/users');
app.use('/auth', authRouter)
app.use('/messages', messagesRouter);
app.use('/room', roomRouter);
app.use('/user', userRouter);


try {
    server.listen(process.env.PORT, function(){
        console.log(`La app está montada en el puerto: ${process.env.PORT}`);
    })
} catch (error) {
    console.log("ha ocurrido en error al montar la aplicacion "+error);
}

