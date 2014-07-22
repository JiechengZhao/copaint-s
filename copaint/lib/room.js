var roomMap = {}
var roomHistory = {'':[]}

exports.roomMap = roomMap
exports.roomHistory = roomHistory


exports = module.exports = function(socket){
	socket.joinroom = joinRoom
	socket.getRoom = getRoom
	socket.leaveRoom = leaveRoom
	socket.getHistory = getHistory
	socket.pushHistory = pushHistory
	socket.cleanHistory = cleanHistory
	socket.room = ''

	return socket
}


function joinRoom(room){
	roomMap[this.id] = room
	this.room = room
}

function getRoom(){
	return roomMap[this.id]
}

function leaveRoom(room){
	delete roomMap[this.id]
}

function getHistory(){
	roomHistory[this.room] = roomHistory[this.getRoom()] || []
	return  roomHistory[this.getRoom()]
}

function pushHistory(message){
	roomHistory[this.room] = roomHistory[this.getRoom()] || []
	roomHistory[this.room].push(message)
}

function cleanHistory(message){
	roomHistory[this.room] = []
}
