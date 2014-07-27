var express = require('express');
var room = require('../lib/room')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'copaint', list : room.getRoomList() });
});


router.get('/:room', function(req, res) {
  res.render('board', { title: 'copaint' });
});

module.exports = router;
