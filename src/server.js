var express = require('express')
var path = require('path')
var app = express()

app.use(express.static(path.join(__dirname, '../static')));
app.get('/see', function(req, res) {
    req.pipe(res)
})

app.get('/draw', function(req, res) {
    req.pipe(res)
})
app.listen(3456)