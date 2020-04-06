var width = 960;
var height = 500;
const MAP_BG_COLOR = "#cdc597";



//For the Map
var svg = d3
  .select("#map-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);


//barchart age
var svg_age = d3
  .select("#chart-container-age")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//barchart race
var svg_race = d3
  .select("#hart-container-race")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//barchart income
var svg_income = d3
  .select("#hart-container-income")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg.call(d3.zoom().on("zoom", function () {
       svg.attr("transform", d3.event.transform)
       //svg.attr("translate", d3.event.translate)
    }))

// create projection for coordinates on map
var projection = d3
  .geoAlbersUsa()
  .translate([width / 2, height / 2])
  .scale(width);

var path = d3.geoPath().projection(projection);
d3.json("us.json", function(err, us) {
  d3.csv("data/SBNFoodFestivalAttendee2019Data.csv", function(cities) {
    //Map Zipcode Data
    drawMap(us, cities);

    drawAge(cities); 
  });
});


var brush = d3.brush().on("start brush", highlight).on("end", brushend);

function drawAge(cities) {
  let margin = {
    top: 20,
    right: 30,
    bottom: 40,
    left: 30
  }

    // Create a scale
  let xScale = d3.scaleLinear()
                  .domain([
                    d3.min(cities, function(d) { return d.Age; }),
                    d3.max(cities, function(d) { return d.Age; })
                  ])
                  .range([margin.left, width - margin.right])

  let yScale = d3.scaleLinear()
                  .domain([
                    d3.min(cities, function(d) { return d.Age; }),
                    d3.max(cities, function(d) { return d.Age; })
                  ])
                  .range([height - margin.bottom, margin.top])


  // Create an axis
  let xAxis = d3.axisTop()
                .scale(xScale)
                .ticks(5);
  let yAxis = d3.axisRight()
                .scale(yScale)
                .ticks(5);

  // var svg = d3.select("svg"),
  //       margin = 200,
  //       width = svg.attr("width") - margin,
  //       height = svg.attr("height") - margin;

  // var xScale = d3.scaleBand().range ([0, width]),
  //     yScale = d3.scaleLinear().range ([height, 0]);



  // Render the axis
  svg_age.append('g')
      .call(xAxis)
      .attr('transform', 'translate(0,' + (height - 5) + ')')
  svg_age.append('g').call(yAxis)
  console.log(yScale)
}


function drawMap(us, cities) {
  var mapGroup = svg.append("g").attr("class", "mapGroup");

  // draw the background map
  mapGroup
    .append("g")
    // .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "states")
    .style("fill", MAP_BG_COLOR);

  // draw each point on the map
  var circles = svg.selectAll('circle')
                   .data(cities)
                   .enter()
                   .append("circle")
                   .attr('class', 'cities')
                   .attr('cx', function(d) {
                      if (!projection([d.Lon, d.Lat])) {
                       return;
                      }
                     return projection([d.Lon, d.Lat])[0];
                   })
                   .attr('cy', function(d) {
                      if (!projection([d.Lon, d.Lat])) {
                       return;
                      }
                    return projection([d.Lon, d.Lat])[1];
                   })
                   .attr("r", 4);
    svg.append("g").call(brush);
}

// Enable selection of group of points on map
function highlight() {
  if (d3.event.selection === null) return;

  let [[x0, y0], [x1, y1]] = d3.event.selection;

  circles = d3.selectAll("circle");
  circles.classed(
      'selected', 
      d =>
          projection([d.Lon, d.Lat]) &&
          x0 <= projection([d.Lon, d.Lat])[0] &&
          projection([d.Lon, d.Lat])[0] <= x1 &&
          y0 <= projection([d.Lon, d.Lat])[1] &&
          projection([d.Lon, d.Lat])[1] <= y1 
           
  );
}
function brushend() {
}