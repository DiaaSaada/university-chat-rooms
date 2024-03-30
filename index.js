const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 3003
const path = require('path');

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});


app.get('/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    // Render the index.ejs file with the roomId value
    res.render('index', {roomId: roomId});
});

// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {
    console.log('user connected');
    socket.on('msg', (data) => {
        console.log(`message: ${data.room}`);
        tech.in(data.room).emit("msg", data.msg);
        // samae as
        // tech.to(data.room).emit("msg", data.msg);
    });

    socket.on('join', (data) => {
        console.log(`request to join: ${data.room}`);
        socket.join(data.room);
        console.log(`joined: ${data.room}`);
        tech.to(data.room).emit("msg", `New User joined room ${data.room}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        tech.emit('msg', 'user disconnected');
    })
})