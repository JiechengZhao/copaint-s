var socketio = require('socket.io')

module.exports = function copaintIoServer( server){
    io = socketio.listen(server)
    
    io.sockets.on('connection', function (socket){
        console.log(socket.id,'connected')
        socket.on('draw',function(message){
            console.log(socket.id,message)
            socket.broadcast.emit('saw',message)
        })

        socket.on('log',function(message){
            console.log(socket.id,message)
        })
        
        socket.on('disconnect',function(){
            console.log(socket.id,'disconnected')
        })
    })
}