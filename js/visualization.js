var width = 960;
var height = 500;
const MAP_BG_COLOR = "#cdc597";



//For the Map
var svg = d3
  .select("#map-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg.call(d3.zoom().on("zoom", function () {
       svg.attr("transform", d3.event.transform)
       //svg.attr("translate", d3.event.translate)
    }))

var projection = d3
  .geoAlbersUsa()
  .translate([width / 2, height / 2])
  .scale(width);

var path = d3.geoPath().projection(projection);
//Map Zipcode Data
d3.json("us.json", function(err, us) {
  d3.csv("data/SBNFoodFestivalAttendee2019Data.csv", function(cities) {
    drawMap(us, cities);
  });
});


var brush = d3.brush().on("start brush", highlight).on("end", brushend);


function drawMap(us, cities) {
  var mapGroup = svg.append("g").attr("class", "mapGroup");

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


function highlight() {
  if (d3.event.selection === null) return;

  let [[x0, y0], [x1, y1]] = d3.event.selection;

  circles = d3.selectAll("circle");
  //console.log('highlight: ', circles);
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