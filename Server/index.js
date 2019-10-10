const io = require('socket.io')(3000);
const arrUserInfor = [];
io.on('connection', socket => {
    socket.on('registerUser', user => {
        const isExist = arrUserInfor.some(e => e.username == user.username)
        socket.peerId = user.peerId;
        if (isExist) return socket.emit('registerFail');
        arrUserInfor.push(user);
        socket.emit('onlineList', arrUserInfor);
        socket.broadcast.emit('newUser', user);
    });
    socket.on('disconnect', () => {
        const index = arrUserInfor.findIndex(user => user.peerId === socket.peerId)
        arrUserInfor.splice(index, 1);
        io.emit('disconnect', socket.peerId)
    })
});