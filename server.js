
const io = require('socket.io')(8000)
const users = {}

io.on('connection', socket => {

  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })

  socket.on('send-chat-message', data => {
    const value = { message: data.text, image: data.image, name: users[socket.id] }
    socket.broadcast.emit('chat-message', value)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
  
})
