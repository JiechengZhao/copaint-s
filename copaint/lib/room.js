var roomHistory = {'':[]}
var roomCount = {'':0}

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
	}).map(function(x){
		return x.slice(1)
	})
}

function joinRoom(room){
	this.room = room
	roomHistory[this.room] = roomHistory[this.getRoom()] || []
	roomCount[this.room] = roomCount[this.room] || 0
	++roomCount[this.room]
}

function getRoom(){
	return this.room
}


function leaveRoom(){
	roomCount[this.room] = roomCount[this.room] 
	--roomCount[this.room]
	var thisroom = this.room
	if (roomCount[this.room] == 0){
		setTimeout(function(){
			if (roomCount[thisroom] == 0){
				delete roomCount[thisroom]
				delete roomHistory[thisroom]
			}
		},60000*60*12)
	}
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

