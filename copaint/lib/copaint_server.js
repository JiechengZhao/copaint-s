var socketio = require('socket.io')

var roomMap = {}
var roomHistory = {'':[]}

module.exports = function copaintIoServer( server){
    io = socketio.listen(server)
    
    io.sockets.on('connection', function (socket){
        var room = ''
        console.log(socket.id,'connected')
        socket.on('draw',function(message){
            console.log(socket.id,message)
            var his = roomHistory[room] ||roomHistory['']
            his.push(message)
            socket.broadcast.to(roomMap[socket.id]).emit('saw',message)
        })

        socket.on('enterRoom',function (message){
            console.log(socket.id,message)
            roomMap[socket.id] = message
            socket.join(message)
            room = message
            roomHistory[message] =  roomHistory[message] || []
            socket.emit('enterRoom',null)
        })

        socket.on('cleanRoom',function(message){
            roomHistory[room] = []
            socket.broadcast.to(roomMap[socket.id]).emit('cleanRoom',message)
        })

        socket.on('history',function(message){
            socket.emit('history',roomHistory[room])
        })

        socket.on('log',function(message){
            console.log(socket.id,message)
        })
        
        socket.on('disconnect',function(){
            delete roomMap[socket.id]
            console.log(socket.id,'disconnected')
        })
    })
}