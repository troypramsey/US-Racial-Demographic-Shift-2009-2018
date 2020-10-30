let margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
}

let years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]

let height = 800, width = 1000

let defaultOption = 2009

let dropdown = d3.select('#dropdown-container')
    .append('select')
    .classed('form-control form-control-lg', true)
    .attr('id', 'dropdown')

let selections = dropdown.selectAll('option')
    .data(years)
    .join('option')
    .attr('value', d => d)
    .attr('class', 'year')
    .text(d => d)

drawMap(defaultOption)

dropdown.on('change', function() {
    year = dropdown.node().value
    drawMap(year)
})


let tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .attr('style', 'position: absolute; visibility: hidden; background: #fafafa; padding: 2px; text-align: center; width: 200px;')
    .style('left', '900px')

let countyCard = d3.select('#county-card')

let svg = d3.select('#map')
    .append('svg')
    .attr('height', height)
    .attr('width', width)

let zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', zoomed);

function zoomed() {
    svg
        .selectAll('path') // To prevent stroke width from scaling
        .attr('transform', d3.event.transform);
    }

svg.call(zoom)



function drawMap(year) {
    d3.json('./static/js/us.json').then(data => {
    let mapData = data
    let dataQuery = './data/census' + year + '.json'

    d3.json(dataQuery).then(data => {
        let popData = data

        let color = d3.scaleLinear()
        .domain([1,35])
        .range(['#FAFAFA', '#2DC200']);

   
        let projection = d3.geoAlbersUsa()
        .translate([width/2, height/2])
        .scale(1000)

        let path = d3.geoPath()
            .projection(projection)

            let counties = topojson.feature(mapData, mapData.objects.counties).features

            let states = topojson.feature(mapData, mapData.objects.states).features
       
            svg.selectAll('.county')
            .data(counties)
            .join('path')
            .classed('county', true)
            .attr('d', path)
            .attr('fill', function(d) {
                let id = d.id
                let county = popData.find((item) => {
                    return item.fips === id
                })
                let percentage
                try {
                    percentage = county['nonwhite_pct']
                }
                catch (err) {
                    percentage = 1
                }
                return color(percentage)
            })
            .on('mouseover', function(countyItem)  {
                tooltip.transition()
                    .style('visibility', 'visible')
                    .style('left', (d3.event.pageX+40) + 'px')
                    .style('top', (d3.event.pageY -28) + 'px')
                let fips = countyItem.id
                let county = popData.find((item) => {
                    return item.fips === fips
                })
                let name, percentage
                try {
                    name = county.county_name
                    stateName = county.state_name
                    percentage = county.nonwhite_pct
                    black = county.black_pct
                    latinx = county.latinx_pct
                    native = county.native_pct
                    asian = county.asian_pct
                }
                catch (err) {
                    name = 'Data Missing From Census'
                    stateName = 'Unknown'
                    percentage = 'Unknown'
                    black = 'Unknown'
                    latinx = 'Unknown'
                    native = 'Unknown'
                    asian = 'Unknown'
                }

                tooltip.html(name + ', ' + stateName)
            })
            .on('mouseout', function (countyItem)  {
                tooltip.transition()
                    .style('visibility', 'hidden')

                    
            })
            .on('click', function(countyItem)  {
                
                let fips = countyItem.id
                let county = popData.find((item) => {
                    return item.fips === fips
                })
                let name, percentage
                try {
                    name = county.county_name
                    percentage = county.nonwhite_pct
                    black = county.black_pct
                    latinx = county.latinx_pct
                    native = county.native_pct
                    asian = county.asian_pct
                }
                catch (err) {
                    name = 'Data Missing From Census'
                    percentage = 'Unknown'
                    black = 'Unknown'
                    latinx = 'Unknown'
                    native = 'Unknown'
                    asian = 'Unknown'
                }

                countyCard.html(year + '<br>' + name + ', ' + stateName + '<br>' + percentage + '% nonwhite' + '<br>' + 'Black: ' + black + '%<br>' + 'Latinx: ' + latinx + '%<br>' + 'Native American: ' + native + '%<br>' + 'Asian-American: ' + asian + '%')
            })
            
            svg.selectAll('.state')
            .data(states)
            .join('path')
            .classed('state', true)
            .attr('d', path)
            .attr('stroke-width', '2')
            .attr('fill', 'none')

    })

        

        
        // .attr('fill', function(d) {
        //     return color(data[1].pct_white = data[1].fips.get(d.id))
        // })
}
)
}

    
    
