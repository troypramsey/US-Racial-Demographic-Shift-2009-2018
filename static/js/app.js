// Map size/margin values
let height = 500, width = 800

// DROPDOWN
// Values for building map dropdown
// Default year on page initialization
let defaultOption = 2009

let years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]

// D3 to build map dropdown
const mapDropdown = d3.select('#dropdown-container')
    .append('select')
    .classed('form-inline form-control-lg', true)
    .attr('id', 'dropdown')

// D3 to build selection for each year
let mapSelections = mapDropdown.selectAll('option')
    .data(years)
    .join('option')
    .attr('value', d => d)
    .attr('class', 'year')
    .text(d => d)

// Draw initial map
drawMap(defaultOption)
drawChart(defaultOption)

// Event listener for change in year
mapDropdown.on('change', function() {
    year = mapDropdown.node().value
    drawMap(year)
    drawChart(year)
})

// Draw responsive canvas
let svg = d3.select('#map')
    .append('svg')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr('style', 'background-color: #4F4F4F;')

function drawChart(year) {
    d3.json(`/by_state_year/Kentucky/${year}`).then(data => {
        var layout = {
            height: 600,
            width: 800
        }

        let counties = data.map(d => d.county_name)
        let percentages = data.map(d => d.nonwhite_pct)


        let data1 = [{
            x: counties,
            y: percentages,
        }]

        Plotly.newPlot('plotly', data1, {responsive: true})
    })
}

// DRAW MAP FUNCTION
// Pass in year from dropdown
function drawMap(year) {
    // TopoJSON object data
    d3.json('../static/js/us.json').then(data => {
    let mapData = data

    // Use query to pull in population data
    d3.json(`/by_year/${year}`).then(data => {
        
        let popData = data

        // Call function to update summary card
        updateSummary(popData)

        // Build tooltip with initial hidden visibility
        let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .attr('style', 'position: absolute; visibility: hidden; background: #4F4F4F; padding: 2px; text-align: center; width: 200px; color: #FAFAFA; opacity: 0.8; border-radius: 10px; border: .5px solid #FAFAFA')
        
        // County card displays static county information on click
        let countyCard = d3.select('#county-card')

        // Building zoom function (Credit: Vasco Asturiano: https://bl.ocks.org/vasturiano/f821fc73f08508a3beeb7014b2e4d50f)
        let zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', zoomed);

        function zoomed() {
            svg
                .selectAll('path') // To prevent stroke width from scaling
                .attr('transform', d3.event.transform);
            }

        // Calling zoom function on map
        svg.call(zoom)

        // Map projection object
        let projection = d3.geoAlbersUsa()
        .translate([width/2, height/2])
        .scale(1000)

        // Path constructor takes in county and state data from TopoJSON object
        let path = d3.geoPath()
            .projection(projection)

            // County borders from TopoJSON
        let counties = topojson.feature(mapData, mapData.objects.counties).features
        // State borders from TopoJSON
        let states = topojson.feature(mapData, mapData.objects.states).features
    
        // D3 binds data from population datasets to TopoJSON polygons
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
            if (percentage > 50){
                return 'limegreen'
            }else {
                return 'lightgray'
            }
        })
        // Unhides tooltip on mouseover
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
            }
            catch (err) {
                name = 'Data Missing From Census'
                stateName = 'Unknown'
            }

            tooltip.html(name + ', ' + stateName)
        })
        // Re-hides tooltip on mouseout
        .on('mouseout', function (countyItem)  {
            tooltip.transition()
                .style('visibility', 'hidden')    
        })
        // Updates information in card on click
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

            countyCard.html('<h3>' + name + ', ' + stateName + '</h3><br><h5>Nonwhite: ' + percentage + '%</h5><br>' + '- Black: ' + black + '%<br>' + '- Hispanic or Latino: ' + latinx + '%<br>' + '- Native American: ' + native + '%<br>' + '- Asian-American: ' + asian + '%')
        })
        
        // Draws state borders on top of county map
        svg.selectAll('.state')
        .data(states)
        .join('path')
        .classed('state', true)
        .attr('d', path)
        .attr('stroke-width', '2')
        .attr('fill', 'none')

    })

})}

// Function updates map summary card
function updateSummary(data) {
    let summary = d3.select('#total-summary')
        .classed('card-body', true)

    let ratio = 0
    let total = data.length

    data.forEach(d => {
        if (d.nonwhite_pct > 50) {
            ratio += 1
        }
    })

    summary.html(`Majority Nonwhite<br>${ratio}/${total}`)
}

    
    
