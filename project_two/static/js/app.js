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
    .append('g')

let data2011;

function getColor(id, dataset) {
    let d = (Object.values(dataset[id]['%_white']))
    d>90?'red':
    d>70?'orange':
    d>50?'yellow':
    d>30?'green':
    'blue'
    console.log(d)
    console.log(dataset)
}

d3.json('./static/js/us.json').then(data => {
    console.log(data)
    let projection = d3.geoAlbersUsa()
    .translate([width/2, height/2])
    .scale(1000)

    let path = d3.geoPath()
        .projection(projection)

    let states = topojson.feature(data, data.objects.states).features
    console.log(states)

    d3.json('./static/js/states2011.json').then(data => {
        data2011 = data
        console.log(data2011)

        svg.selectAll('.state')
        .data(states)
        .join('path')
        .classed('state', true)
        .attr('d', path)
        .attr('fill', getColor(states.id, data2011))
        })
    })
    
    
