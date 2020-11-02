// D3 to build states dropdown
let stateNames = ["Alaska", "Alabama", "Arkansas", "Arizona", "California", "Colorado", 
"Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Iowa", "Idaho", 
"Illinois", "Indiana", "Kansas", "Kentucky", "Louisiana", "Massachusetts", "Maryland", "Maine", "Michigan", "Minnesota", 
"Missouri", "Mississippi", "Montana", "North Carolina", "North Dakota", "Nebraska", "New Hampshire", "New Jersey", "New Mexico", 
"Nevada", "New York", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",  "Rhode Island", "South Carolina", "South Dakota", 
"Tennessee", "Texas", "Utah", "Virginia", "Vermont", "Washington", "Wisconsin", "West Virginia", "Wyoming"]

const stateDropdown = d3.select('#stateDrop')
    .append('select')
    .classed('form-inline form-control-lg', true)
    .attr('id', 'states')

// D3 to build selection for each state
let stateSelections = stateDropdown.selectAll('option')
    .data(stateNames)
    .enter()
    .append('option')
    .attr('value', d => d)
    .attr('class', 'stateName')
    .text(d => d)

let years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]
// D3 to build map dropdown
const yearDropdown = d3.select('#yearDrop')
    .append('select')
    .classed('form-inline form-control-lg', true)
    .attr('id', 'year')
// D3 to build selection for each year
let yearSelections = yearDropdown.selectAll('option')
    .data(years)
    .enter()
    .append('option')
    .attr('value', d => d)
    .attr('class', 'year')
    .text(d => d)    

// // dimensions and margins
// // reference: https://www.d3-graph-gallery.com/graph/lollipop_basic.html
var margins = {top: 30, right: 0, bottom: 30, left: 50},
    width = 800 - margins.left - margins.right,
    height = 400 - margins.top - margins.bottom;

//append svg object to body on page
var svg = d3.select("#plotly")
    .append("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margins.left + "," + margins.top + ")");



//state filter handler
function stateHandler() {
    //prevent refreshing
    d3.event.preventDefault();

    //select input value
    var state = d3.select("#states").node().value;
    console.log(state);

    //clear input
    d3.select("#state").node().value = "";

    //build plot with new state
    leafPlot(state);

}
 d3.select("#states").on("change", stateHandler);

//function for everything below
function leafPlot(state) {
    // read in data from api call
    d3.json(`/by_state_year/Oregon/${year}`).then(data => {
        var layout = {
            height: 600,
            width: 800
        }
        let counties = data.map(d => d.county_name)
        let percentages = data.map(d => d.nonwhite_pct)

        let data1 = [{
            x: counties,
            y: percentages 
        }]
        updatePlotly.newPlot('plotly', data1)
    })
}