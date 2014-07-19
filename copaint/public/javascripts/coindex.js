var socket = io.connect()

$(document).ready(function() {
    var svg = d3.select('svg')

    var line = d3.svg.line()
    .x(function(d) {return d[0] })
    .y(function(d) {return d[1] })
    
    var data = [[1,1],[899,1],[899,499],[1,499],[1,1]]
    
    var path = svg.append('path')
    .datum(data)
    .attr('d',line)
    

    data = []
    path = svg.append('path')
    .datum(data)
    .attr('d',line)





    var msvg = document.getElementById("mainsvg")

    msvg.addEventListener("touchstart", function(e){
        e.preventDefault();

        if (e.touches.length == 1){
            var x = [ e.touches[0].pageX ,e.touches[0].pageY ]
            data.push(x)

        }
    })

    msvg.addEventListener("touchmove", function(e){
        if (e.touches.length == 1){
            var x = [ e.touches[0].pageX ,e.touches[0].pageY ]
            data.push(x)
            path.datum(data)
            .attr('d',line)
        }
    })

    msvg.addEventListener("touchend",function(e){
        socket.emit('draw',data)
        data = []
        path = svg.append('path')
          .datum(data)
          .attr('d',line)
    })


    svg.on("mousedown",function(){
        data.push(d3.mouse(this))
        svg.on("mousemove", function(){
            data.push(d3.mouse(this))
            path.datum(data)
            .attr('d',line)
        })
    })

    svg.on("mouseup",function(){
        socket.emit('draw',data)
        data = []
        path = svg.append('path')
        .datum(data)
        .attr('d',line)

        svg.on("mousemove",null)
    })


    socket.on("saw",function(message){
        svg.append('path')
        .datum(message)
        .attr('d',line)
        .style('stroke','#202')
    })
})
