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
var svg = d3.select("#plot")
    .append("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margins.left + "," + margins.top + ")");


//function for everything below
function leafPlot(state) {
    // read in data from api call
    d3.json(`/by_state_name/${state}`).then(data => {
        console.log(data);

    //x axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function(d) {return d.county_name}))
        .padding(1);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transfrom", "translate(-10,0)rotate(-90)")
            .style("text-anchor", "end");

    //add y axis
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    //Lines
    svg.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
            .attr("x1", function(d) {return x(d.county_name);})
            .attr("x2", function(d) {return x(d.county_name);})
            .attr("y1", function(d) {return y(d.nonwhite_pct);})
            .attr("y2", y(0))
            .attr("stroke", "gray")

    // circles
    svg.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) {return x(d.county_name);})
            .attr("cy", function(d) {return y(d.nonwhite_pct);})
            .attr("r", "4")
            .style("fill", "#69b3a2")
            .attr("stroke", "black")
    });
}

leafPlot('Oregon');

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