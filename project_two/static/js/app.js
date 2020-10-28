let margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
}

let height = 800, width = 1000

let svg = d3.select('#map')
    .append('svg')
    .attr('height', height)
    .attr('width', width)

let population = d3.map()

// var path = d3.geoPath();

var x = d3.scaleLinear()
    .domain([1, 10])
    .rangeRound([600, 860]);

var color = d3.scaleLinear()
    .domain([24,96])
    .range(['white', 'blue']);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

// g.selectAll("rect")
//   .data(color.range().map(function(d) {
//       d = color.invertExtent(d);
//       if (d[0] == null) d[0] = x.domain()[0];
//       if (d[1] == null) d[1] = x.domain()[1];
//       return d;
//     }))
//   .enter().append("rect")
//     .attr("height", 8)
//     .attr("x", function(d) { return x(d[0]); })
//     .attr("width", function(d) { return x(d[1]) - x(d[0]); })
//     .attr("fill", function(d) { return color(d[0]); });

// g.append("text")
//     .attr("class", "caption")
//     .attr("x", x.range()[0])
//     .attr("y", -6)
//     .attr("fill", "#000")
//     .attr("text-anchor", "start")
//     .attr("font-weight", "bold")
//     .text("White Population (%)");

// g.call(d3.axisBottom(x)
//     .tickSize(13)
//     .tickFormat(function(x, i) { return i ? x : x + "%"; })
//     .tickValues(color.domain()))
//   .select(".domain")
//     .remove();

// let promises = [
//     d3.json('./static/js/us.json'),
//     d3.json('./static/js/states2011.json')
// ]

d3.json('./static/js/us.json').then(data => {
    let mapData = data
    d3.json('./static/js/states2011.json').then(data => {
        let popData = data
   
        let projection = d3.geoAlbersUsa()
        .translate([width/2, height/2])
        .scale(1000)

        let path = d3.geoPath()
            .projection(projection)

            let states = topojson.feature(mapData, mapData.objects.states).features
            console.log(states)
            console.log(popData)

            svg.selectAll('.state')
            .data(states)
            .join('path')
            .classed('state', true)
            .attr('d', path)
            .attr('fill', function(d) {
                let id = d.id
                let state = popData.find((item) => {
                    return item.fips === id
                })
                let percentage = state['pct_white']
                if (percentage < 30) {
                    return 'white'
                }else if (percentage < 50) {
                    return 'green'
                }else if (percentage < 70) {
                    return 'yellow'
                }else if (percentage < 90) {
                    return 'orange'
                }else {
                    return 'red'
                }
            })
    })

        

        
        // .attr('fill', function(d) {
        //     return color(data[1].pct_white = data[1].fips.get(d.id))
        // })
}
)


    
    
