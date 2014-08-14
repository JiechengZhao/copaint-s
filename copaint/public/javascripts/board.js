$(document).ready(function() {



    var socket = io.connect()

    var xyswaper = (function _xyswaper(){

        var scaler = function(long,short){
            var sr = {long: 9000,short: 6000}
            var sl = sr.long/long
            var ss = sr.short/short

            var scaler
            if (sl < ss){
                scaler = ss
                long = Math.ceil(short * sr.long / sr.short)
            }else{
                scaler = sl
                short = Math.ceil(long * sr.short / sr.long)
            }

            return {
                long:long,
                short:short,
                scaler:scaler,
                rscaler:1 / scaler}

        }


        var r = function(x){
            return r.f(x)
        }

        var width = $(window).width(),
            height = $(window).height()

        if (width > height){
            var sclr = scaler(width-15,height-50)

            r.width = sclr.long
            r.height = sclr.short
            r.f = function(x) {return [x[0]*sclr.scaler,x[1]*sclr.scaler].map(Math.round)}
            r.r = function(y) {return y}
            r.transform = "scale("+sclr.rscaler+")"
        }else{
            var sclr = scaler(height-50,width-15)

            r.height = sclr.long
            r.width = sclr.short
            r.f = function(x) {return [x[1]*sclr.scaler,(r.width - x[0])*sclr.scaler].map(Math.round)}
            r.r = function(y) {return y}
            r.transform =  "matrix(0,"+sclr.rscaler+","+(-sclr.rscaler)+",0,"+(r.width)+",0)"
        }
        r.edgepath = [[1,1],[r.width-1,1],[r.width-1,r.height-1],[1,r.height-1],[1,1]]
        return r


    })()

    var svg = d3.select('svg')
        .attr('width',xyswaper.width)
        .attr('height',xyswaper.height)

    var line = d3.svg.line()
    .x(function(d) {return d[0] })
    .y(function(d) {return d[1] })
    
    var path = svg.append('path')
    .datum(xyswaper.edgepath)
    .attr('d',line)


    var canvas = svg.select('g#g_layer')
        .attr("transform",xyswaper.transform)

    var colors = (function _colorpickerInit(){
        var colorpicker = svg.select('g#colorpicker')
            .attr("transform",xyswaper.transform)

        var colors = Object.keys(colorlist)
        for (var i = 0 ; i< 16; i ++){
            colorpicker.append('rect')
              .attr("x", (i&3)*2250+250)
              .attr("width",1750)
              .attr("y", (i>>2)*1500+250)
              .attr("height", 1000)
              .attr("rx",100)
              .attr("ry",100)
              .attr("fill",colorlist[colors[i]])
        }
        return colors
    })();

    var msvg = document.getElementById('mainsvg')

    msvg.addEventListener('touchstart', function(e){
        if (e.touches.length == 1){
            e.preventDefault();
            data = []
            path = canvas.append('path')
            .datum(data)
            .attr('d',line)
            var x = [ e.touches[0].pageX ,e.touches[0].pageY ]
            x = xyswaper(x)
            data.push(x)

        }else{
            data = []
            path.datum(data.map(xyswaper.r))
            .attr('d',line)
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
        if (data.length) socket.emit('draw',data)
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
    d3.selectAll('svg g#g_layer path').remove()
}