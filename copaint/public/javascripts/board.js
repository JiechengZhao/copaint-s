$(document).ready(function() {



    var socket = io.connect()

    var xyswaper = (function _xyswaper(){
        r = function(x){
            return r.f(x)
        }
        if ($(window).width() > $(window).height()){
            r.width = 900
            r.height = 600
            r.f = function (x) {return x}
            r.r = r.f
        }else{
            r.width = 600
            r.height = 900
            r.f = function(x) {return [x[1],r.width-x[0]]}
            r.r = function(y) {return [r.width-y[1],y[0]]}
        }
        r.edgepath = [[1,1],[r.width-1,1],[r.width-1,r.height-1],[1,r.height-1],[1,1]]
        return r;


    })()

    var svg = d3.select('svg')
        .attr('width',xyswaper.width)
        .attr('height',xyswaper.height)

    var line = d3.svg.line()
    .x(function(d) {return d[0] })
    .y(function(d) {return d[1] })
    
    var path = svg.append('path')
    .datum(r.edgepath)
    .attr('d',line)

    
    var canvas = svg.select('g')


    var msvg = document.getElementById('mainsvg')

    msvg.addEventListener('touchstart', function(e){
        e.preventDefault();
        if (e.touches.length == 1){
            data = []
            path = canvas.append('path')
            .datum(data)
            .attr('d',line)
            var x = [ e.touches[0].pageX ,e.touches[0].pageY ]
            x = xyswaper(x)
            data.push(x)

        }
    })

    msvg.addEventListener('touchmove', function(e){
        if (e.touches.length == 1){
            var x = [ e.touches[0].pageX ,e.touches[0].pageY ]
            x = xyswaper(x)
            data.push(x)
            path.datum(data.map(xyswaper.r))
            .attr('d',line)
        }
    })

    msvg.addEventListener('touchend',function(e){
        socket.emit('draw',data)
    })


    svg.on('mousedown',function(){
        data = []
        path = canvas.append('path')
            .datum(data)
            .attr('d',line)
        data.push(xyswaper(d3.mouse(this)))
        svg.on('mousemove', function(){
            data.push(xyswaper(d3.mouse(this)))
            path.datum(data.map(xyswaper.r))
                .attr('d',line)
        })
    })

    svg.on('mouseup',function(){
        socket.emit('draw',data)
        svg.on('mousemove',null)
    })


    socket.on('saw',function(message){
        canvas.append('path')
        .datum(message.map(xyswaper.r))
        .attr('d',line)
        .style('stroke','#202')
    })

    socket.on('cleanRoom',cleanRoom)

    socket.on('history',function(message){
        for (var i = 0; i < message.length; i++){
            canvas.append('path')
            .datum(message[i].map(xyswaper.r))
            .attr('d',line)
        }
    })

    socket.on('enterRoom',function(message){
        socket.emit('history')
    })

    socket.on('connect',function(){
        console.log('enterRoom', location.pathname)
        socket.emit('enterRoom', location.pathname)
    })


    $('#clean').on('click',function(){
        socket.emit('cleanRoom',null)
        cleanRoom()
    })

})

function cleanRoom(){
    d3.selectAll('svg g path').remove()
}