var rooms = {'':{his:[],cnt:0,nm:'',seq:0} }

exports = module.exports = function(socket){
	socket.joinRoom = joinRoom
	socket.getRoom = getRoom
	socket.leaveRoom = leaveRoom
	socket.getHistory = getHistory
	socket.pushHistory = pushHistory
	socket.cleanHistory = cleanHistory
	socket.getSeq = getSeq
	return socket
}

exports.getRoomList = function getRoomList(){
	return Object.keys(rooms).map(decodeURI)
	.filter(function(i){
		return i.length<=8 && i != ''
	}).map(function(x){
		return x.slice(1)
	})
}

function joinRoom(room){
	this.room = rooms[room] = rooms[room] || {his:[],cnt:0,nm:room,seq:0}
	++this.room.cnt
	++this.room.seq
	this.roomseq = this.room.seq
}

function getRoom(){
	return this.room.nm
}


function leaveRoom(){
	if (this.room === null) return
	--this.room.cnt
	var roomname  = this.room.nm
	if (this.room.cnt == 0){
		setTimeout(function(){
			if ( rooms[roomname].cnt == 0){
				delete rooms[roomname]
			}
		},60000*60*12)
	}
	this.room = null
}

function getHistory(){
	return  this.room.his
}

function getSeq(){
	return this.roomseq
}

function pushHistory(message){
	this.room.his.push(message)
}

function cleanHistory(message){
	this.room.his = []
}
