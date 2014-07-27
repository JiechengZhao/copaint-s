var roomHistory = {'':[]}

exports = module.exports = function(socket){
	socket.joinRoom = joinRoom
	socket.getRoom = getRoom
	socket.leaveRoom = leaveRoom
	socket.getHistory = getHistory
	socket.pushHistory = pushHistory
	socket.cleanHistory = cleanHistory
	socket.room = ''

	return socket
}

exports.roomHistory = roomHistory
exports.getRoomList = function getRoomList(){
	return Object.keys(roomHistory).map(decodeURI)
	.filter(function(i){
		return i.length<=8 && i != ''
	})
}

function joinRoom(room){
	roomHistory[this.room] = roomHistory[this.getRoom()] || []
	this.room = room
}

function getRoom(){
	return this.room
}


function leaveRoom(){
	this.room = ''
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

