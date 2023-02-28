require('dotenv').config();
console.log(process.env.HARPERDB_URL);
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const port = 4000;
const clientLink = 'http://localhost:3000';
const harperSaveMessage = require('./services/harper-save-message');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: `${clientLink}`,
        methods: ['GET', 'POST'],
    },
}
);

const CHAT_BOT = 'ChatBot';
let chatRoom = '';
let allUsers = [];

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('join_room', (data) => {
        const { username, room } = data;
        socket.join(room);

        let __createdtime__ = Date.now();
        socket.to(room).emit('receive_message', {
          message: `${username} has joined the chat room`,
          username: CHAT_BOT,
          __createdtime__,  
        });

        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            __createdtime__,
        });

        chatRoom = room;
        allUsers.push({id: socket.id, username, room});
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
    });

    socket.on('send_message', (data) => {
        const { message, username, room, __createdtime__ } = data;
        io.in(room).emit('receive_message', data);
        harperSaveMessage(message, username, room, __createdtime__)
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    });

    
});

app.get('/', (req, res) => {
    res.send('Hello world');
})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})