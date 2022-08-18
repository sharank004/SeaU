const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))
const users={};
io.on('connection', socket => {
  socket.on('new-user-joined', naam => {
    users[socket.id]=naam;
    socket.broadcast.emit('user-joined', naam)
    socket.on('send',message=>{
      socket.broadcast.emit('receive',{message: message, naam: users[socket.id]})
  });
    socket.on('disconnect', message => {
      socket.broadcast.emit('leave', users[socket.id])
      delete users[socket.id];
    })
  })
})
/*app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})*/

app.get('/', (req, res) => {
    res.render('room', { roomId: req.params.room })
  })

server.listen(8000,()=>{
    console.log("Server is active on port 3000")
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId)
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
    })
  })
