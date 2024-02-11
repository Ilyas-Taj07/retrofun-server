import express, { Request, Response } from 'express'
import http from 'http';
import { Server } from 'socket.io';
const PORT = process.env.PORT || 8081

const app = express()
const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://retrofun-ilyas.netlify.app"]
    }
})


let messages: Messages[] = []

let users: Users[] = []

io.on('connection', (socket) => {
    users.push({
        user: socket.id,
        room: null
    })

    console.log(`Connected Id ${socket.id}`)

    // joining the room

    socket.on('join_room', (data) => {

        socket.join(data.roomId)
        io.sockets.in(data.roomId).emit('get_messages', messages.filter(item => item.room === data.roomId))


        users = users.map((item) => {
            if (item.user === socket.id) {
                return {
                    room: data.roomId,
                    user: socket.id
                }
            }
            else {
                return item
            }
        })

        // to get the count of the members in a room
        io.sockets.in(data.roomId).emit('get_count', {
            count: users.filter(item => item.room === data.roomId).length
        })

    })


    // send message

    socket.on('send_message', (data) => {

        const id = Date.now()

        messages.push({
            Id: id,
            message: data.message,
            room: data.roomId,
            type: data.type
        })

        // socket.to(data.roomId).emit('get_messages', messages)

        io.sockets.in(data.roomId).emit('get_messages', messages.filter(item => item.room === data.roomId))

    })


    // update message

    socket.on('update_message', (data) => {

        messages = messages.map((item) => (item.room === data.roomId && item.Id === data.Id) ? { ...item, message: data.newMessage } : item)

        io.sockets.in(data.roomId).emit('get_messages', messages.filter(item => item.room === data.roomId))

    })



    // delete message


    socket.on('delete_message', (data) => {

        messages = messages.filter(item => item.Id !== data.Id)

        io.sockets.in(data.roomId).emit('get_messages', messages.filter(item => item.room === data.roomId))

    })


    // disconnect


    socket.on('disconnect', () => {
        console.log(`Disconnected Id ${socket.id}`)
        users = users.filter(item => item.user === socket.id)

    })

})

app.get('/', (req: Request, res: Response) => {
    ``
    res.send('Retro Fun')

})


app.get('/all-users', (req: Request, res: Response) => {

    res.status(200).json({
        result: users
    })


})


app.get('/room-count/:roomId', (req: Request, res: Response) => {

    const { roomId } = req.params


    let result = users.filter(item => item.room === roomId)

    res.status(200).json({
        room: roomId,
        result: result
    })

})


app.get('/room-messages/:roomId', (req: Request, res: Response) => {

    const { roomId } = req.params


    let result = messages.filter(item => item.room === roomId)

    res.status(200).json({
        room: roomId,
        messages: result
    })


})


server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})


interface Messages {
    Id: number,
    message: string,
    type: string,
    room: string
}


interface Users {
    user: string,
    room: string | null
}