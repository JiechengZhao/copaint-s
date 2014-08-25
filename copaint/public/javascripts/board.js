$(document).ready(function() {

    var socket = io.connect()
    var seq = 0
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
                rscaler:1 / scaler
            }
        }


        var r = function(x){
            return r.f(x)
        }

        var width = $(window).width(),
            height = $(window).height()

        if (width > height){
            var sclr = scaler(width,height)

            r.width = sclr.long
            r.height = sclr.short
            r.f = function(x) {return [x[0]*sclr.scaler,x[1]*sclr.scaler].map(Math.round)}
            r.transform = "scale("+sclr.rscaler+")"
        }else{
            var sclr = scaler(height-50,width-15)

            r.height = sclr.long
            r.width = sclr.short
            r.f = function(x) {return [x[1]*sclr.scaler,(r.width - x[0])*sclr.scaler].map(Math.round)}
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
            var colorRect = colorpicker.append('rect')
              .attr("x", (i&3)*2250+250)
              .attr("width",1750)
              .attr("y", (i>>2)*1500+250)
              .attr("height", 1000)
              .attr("rx",100)
              .attr("ry",100)
              .attr("fill",colorlist[colors[i]]);

            (function(thecolor){
                colorRect[0][0].addEventListener('touchstart', function(e){
                    if (e.touches.length == 1){
                        current_color = thecolor
                        colorpicker.attr("display","none")
                    }
                })

                colorRect[0][0].addEventListener('mousedown', function(e){
                    current_color = thecolor
                    colorpicker.attr("display","none")
                })
            })(colorlist[colors[i]]);
        }
        colors.colorpicker = colorpicker;
        current_color = "black  "
        colorpicker.attr("display","none")
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
            .attr('id','l'+socket.roomid+'.'+seq)
            .style('stroke',current_color)
            var x = [ e.touches[0].pageX ,e.touches[0].pageY ]
            x = xyswaper(x)
            data.push(x)

        }else{
            data = []
            path.datum(data)
            .attr('d',line)
        }
    })

    msvg.addEventListener('touchmove', function(e){
        if (e.touches.length == 1){
            var x = [ e.touches[0].pageX ,e.touches[0].pageY ]
            x = xyswaper(x)
            data.push(x)
            path.datum(data)
            .attr('d',line)
        }
    })

    msvg.addEventListener('touchend',function(e){
        if (data.length) socket.emit('draw',{path:data,stroke:current_color,i:socket.roomid,d:seq++})
    })


    svg.on('mousedown',function(){
        data = []
        path = canvas.append('path')
            .datum(data)
            .attr('d',line)
            .attr('id','l'+socket.roomid+'.'+seq)
            .style('stroke',current_color)
        data.push(xyswaper(d3.mouse(this)))
        svg.on('mousemove', function(){
            data.push(xyswaper(d3.mouse(this)))
            path.datum(data)
                .attr('d',line)
                .attr('stroke',current_color)
        })
    })

    svg.on('mouseup',function(){
        socket.emit('draw', {path:data,stroke:current_color,i:socket.roomid,d:seq++} )
        svg.on('mousemove',null)
    })


    socket.on('saw',function(message){
        canvas.append('path')
        .datum(message.path)
        .attr('d',line)
        .attr('id','l'+message.i+'.'+message.d)
        .style('stroke',message.stroke)
    })

    socket.on('cleanRoom',cleanRoom)

    socket.on('history',function(message){
        socket.roomid = message.i
        var his = message.h
        for (var i = 0; i < his.length; i++){
            canvas.append('path')
            .datum(his[i].path)
            .attr('d',line)
            .attr('id','l'+his[i].i+'.'+his[i].d)
            .style('stroke',his[i].stroke)
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

    $('#color').on('click',function(){
        if (colors.colorpicker.attr("display")){
            colors.colorpicker.attr("display",null)
        }
        else {
            colors.colorpicker.attr("display","none")
        }
    })
})

function cleanRoom(){
    d3.selectAll('svg g#g_layer path').remove()
}