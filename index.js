const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 3003


server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {
    console.log('user connected');
    socket.on('msg', (data) => {
        console.log(`message: ${data.room}`);
        tech.emit('msg', data.msg);
    });

    socket.on('join', (data) => {
        console.log(`request to join: ${data.room}`);
        socket.join(data.room);
        console.log(`joined: ${data.room}`);
        tech.in(data.room).emit("msg", `New User joined room ${data.room}`);
        tech.to(data.room).emit("msg", `New User joined room ${data.room}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        tech.emit('msg', 'user disconnected');
    })
})