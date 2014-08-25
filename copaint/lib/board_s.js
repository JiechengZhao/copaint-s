var socketio = require('socket.io')
var room = require('./room')

module.exports = function copaintIoServer( server){
    io = socketio.listen(server)
    io.sockets.on('connection', function (socket){
        socket = room(socket)
        console.log(socket.id,'connected')

        socket.on('draw',function(message){
            console.log(socket.id,message)
            socket.pushHistory(message)
            socket.broadcast.to(socket.getRoom()).emit('saw',message)
        })

        socket.on('enterRoom',function (message){
            console.log(socket.id,message)
            socket.joinRoom(message)
            socket.join(message)
            socket.emit('enterRoom',null)
        })

        socket.on('cleanRoom',function(message){
            socket.cleanHistory()    
            socket.broadcast.to(socket.room).emit('cleanRoom',message)
        })

        socket.on('history',function(message){
            console.log('history'+socket.getSeq())
            socket.emit('history',{h:socket.getHistory(),i:socket.getSeq()})
        })

        socket.on('log',function(message){
            console.log(socket.id,message)
        })
        
        socket.on('disconnect',function(){
            socket.leaveRoom()
            console.log(socket.id,'disconnected')
        })
    })
}