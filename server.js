const express = require('express')
const {Server} = require('socket.io');
const { connect } = require('socket.io-client');
const app = express()
const http = require('http');
const path = require('path');

const server = http.createServer(app);
const io = new Server(server)

app.use(express.static('build'))
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const userSocketMap = {}

function getAllConnectedUsers(roomID) {
    return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId]
        }
    })
}

io.on('connection', (socket) => {
    // console.log("socket connected" , socket.id)

    socket.on('join', ({roomID, username}) => {
        userSocketMap[socket.id] = username
        socket.join(roomID)

        const users = getAllConnectedUsers(roomID)
        users.forEach(({socketId}) => {
            io.to(socketId).emit('joined', {
                users,
                username,
                socketId: socket.id
            })
        })
    })

    socket.on('code-change', ({roomID, code}) => {
        socket.in(roomID).emit('code-change', {code})
    })

    socket.on('sync-code', ({socketId, code}) => {
        io.to(socketId).emit('code-change', {code})
    })

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((roomID) => {
            socket.in(roomID).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })
        })

        delete userSocketMap[socket.id]
        socket.leave()
    })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log("listening on port:", PORT))