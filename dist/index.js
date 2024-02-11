"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const PORT = process.env.PORT || 8081;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://retrofun-ilyas.netlify.app"]
    }
});
let messages = [];
let users = [];
exports.io.on('connection', (socket) => {
    users.push({
        user: socket.id,
        room: null
    });
    console.log(`Connected Id ${socket.id}`);
    // joining the room
    socket.on('join_room', (data) => {
        socket.join(data.roomId);
        exports.io.sockets.in(data.roomId).emit('get_messages', messages.filter(item => item.room === data.roomId));
        users = users.map((item) => {
            if (item.user === socket.id) {
                return {
                    room: data.roomId,
                    user: socket.id
                };
            }
            else {
                return item;
            }
        });
        // to get the count of the members in a room
        exports.io.sockets.in(data.roomId).emit('get_count', {
            count: users.filter(item => item.room === data.roomId).length
        });
    });
    // send message
    socket.on('send_message', (data) => {
        const id = Date.now();
        messages.push({
            Id: id,
            message: data.message,
            room: data.roomId,
            type: data.type
        });
        // socket.to(data.roomId).emit('get_messages', messages)
        exports.io.sockets.in(data.roomId).emit('get_messages', messages.filter(item => item.room === data.roomId));
    });
    // update message
    socket.on('update_message', (data) => {
        messages = messages.map((item) => (item.room === data.roomId && item.Id === data.Id) ? Object.assign(Object.assign({}, item), { message: data.newMessage }) : item);
        exports.io.sockets.in(data.roomId).emit('get_messages', messages.filter(item => item.room === data.roomId));
    });
    // delete message
    socket.on('delete_message', (data) => {
        messages = messages.filter(item => item.Id !== data.Id);
        exports.io.sockets.in(data.roomId).emit('get_messages', messages.filter(item => item.room === data.roomId));
    });
    // disconnect
    socket.on('disconnect', () => {
        console.log(`Disconnected Id ${socket.id}`);
        users = users.filter(item => item.user === socket.id);
    });
});
app.get('/', (req, res) => {
    ``;
    res.send('Retro Fun');
});
server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
