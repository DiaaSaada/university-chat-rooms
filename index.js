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
    socket.on('msg', (msg) => {
        console.log(`message: ${msg}`);
        tech.emit('msg', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        tech.emit('msg', 'user disconnected');
    })
})