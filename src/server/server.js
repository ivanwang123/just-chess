const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Room = require('./room')

const port = process.env.PORT || 4001

const app = express()

app.use(express.static(__dirname + '/../../build'))

const server = http.createServer(app)

const io = socketio(server)

let rooms = {}

io.on('connection', (socket) => {
    console.log('New client connected')

    socket.on('disconnect', () => {
        if (rooms[socket.roomID]) {
            rooms[socket.roomID].getPlayers().forEach(client => {
                client.disconnect()
            })
            delete rooms[socket.roomID]
        }
        console.log('client disconnected', rooms)
    })

    socket.on('create', ({id, boardSize, pieces, lines}) => {
        socket.roomID = id
        if (!rooms[id])
            rooms[id] = new Room(id)
        socket.join(id, () => {
            rooms[id].addPlayer(socket)
            rooms[id].setBoardSize(boardSize)
            rooms[id].setPieces(pieces)
            rooms[id].setLines(lines)


            let player = 1
            if (rooms[id].getPlayers().length > 1)
                player = -1
            io.in(id).emit('get-cur-player', rooms[id].getCurPlayer())
            io.in(id).emit('get-board-size', rooms[id].getBoardSize())
            io.in(id).emit('get-state', rooms[id].getState())
            
            socket.emit('set-player', player)
            socket.emit('get-pieces', rooms[id].getPieces(player))
        })
    })

    socket.on('join', (id) => {

        if (!rooms[id])
            socket.disconnect()
        else {
            socket.join(id, () => {
                rooms[id].addPlayer(socket)
                const numPlayers = rooms[id].getPlayers().length
    
                if (numPlayers > 2) {
                    socket.disconnect()
                } else {
                    socket.roomID = id

                    let player = 1
                    if (numPlayers > 1)
                        player = -1
                    io.in(id).emit('get-cur-player', rooms[id].getCurPlayer())
                    io.in(id).emit('get-board-size', rooms[id].getBoardSize())
                    io.in(id).emit('get-state', rooms[id].getState())
                    
                    socket.emit('set-player', player)
                    socket.emit('get-pieces', rooms[id].getPieces(player))
                }
            })
        }
    })

    socket.on('move-piece', ({prevRow, prevCol, newRow, newCol, piece, id}) => {
        const room = rooms[id]
        room.movePiece(prevRow, prevCol, newRow, newCol, piece)
        io.in(id).emit('get-cur-player', room.getCurPlayer())
        io.in(id).emit('get-board', room.getBoard())
        io.in(id).emit('get-winner', room.getWinner())
    })
    socket.on('claim-tile', ({row, col, player, id}) => {
        const room = rooms[id]
        room.claimTile(row, col, player)
        io.in(id).emit('get-cur-player', room.getCurPlayer())
        io.in(id).emit('get-state', room.getState())
        io.in(id).emit('get-place-board', room.getPlaceBoard())
    })
    socket.on('get-pieces', ({player, id}) => {
        const room = rooms[id]
        socket.emit('get-pieces', room.getPieces(player))
    })
    socket.on('set-piece', ({row, col, piece, player, id}) => {
        const room = rooms[id]
        room.setPiece(row, col, piece)
        socket.emit('get-board', room.getPlayerBoard(player))
        socket.emit('get-pieces', room.getPieces(player))

        if (room.getPieces(1).length === 0 && room.getPieces(-1).length === 0) {
            if (room.getState() === 1) {
                room.setState(2)
                room.setPieces([1])
                io.in(id).emit('get-state', room.getState())
            } else if (room.getState() === 2) {
                room.setState(3)
                io.in(id).emit('get-state', room.getState())
            }
        }

    })
    socket.on('get-board', (id) => {
        const room = rooms[id]
        io.in(id).emit('get-board', room.getBoard())
    })
    socket.on('get-place-board', (id) => {
        const room = rooms[id]
        io.in(id).emit('get-place-board', room.getPlaceBoard())
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))

