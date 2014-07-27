var room = require('../lib/room')
var assert = require('assert')

describe('room', function(){
	socket = {id: 'abc'}
	socket = room(socket)
	socket.joinRoom('BRoom')
	socket.pushHistory('init history')
	describe('Room',function(){
		it('should leave room', function(){
			socket.leaveRoom()
			assert(socket.room === '' )
		})

		it('should join room', function(){
			socket.leaveRoom()
			assert(socket.room === '' )
			socket.joinRoom('ARoom')
			socket.room.should.equal('ARoom')
			socket.getRoom().should.equal('ARoom')
		})
	})

	describe('History', function(){
		
		it('should clean History',function(){
			socket.cleanHistory()
			room.roomHistory[socket.room].length.should.equal(0)
		})

		it('should push History',function(){
			socket.pushHistory('his abc')
			var his = room.roomHistory[socket.room]
			his[his.length-1].should.equal('his abc')
			his.should.equal(socket.getHistory())
		})
	})

	describe('getRoomList',function(){
		it('should list rooms',function(){
			var list = room.getRoomList()
			list.length.should.be.above(0)
			list.should.containEql('BRoom')
			list.should.containEql('ARoom')
			list.should.not.containEql('')

		})
	})
})