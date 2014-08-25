var room = require('../lib/room')
var assert = require('assert')

describe('room', function(){
	socket = {id: 'abc'}
	socket = room(socket)
	socket.joinRoom('/BRoom')
	socket.pushHistory('init history')
	describe('Room',function(){
		it('should leave room', function(){
			socket.leaveRoom()
			assert(socket.room === null )
		})

		it('should join room', function(){
			socket.joinRoom('/ARoom')
			socket.getRoom().should.equal('/ARoom')
		})
	})

	describe('History', function(){
		s2 = {id:'bcd'}
		s2 = room(s2)
		s2.joinRoom('/ARoom')
		it('should clean History',function(){
			socket.cleanHistory()
			s2.room.his.length.should.equal(0)
		})

		it('should push History',function(){
			socket.pushHistory('his abc')
			var his = s2.room.his
			his[his.length-1].should.equal('his abc')
			his.should.equal(s2.getHistory())
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

	describe('seq',function(){
		it('should be different',function(){
			s2.getSeq().should.not.equal(socket.getSeq())
		})
	})
})
