var columns;
var yheight = 600;
var xwidth = 800;
var binWidth = 50;

var margin = {top: 20, right: 160, bottom: 35, left: 30};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var canvas = d3.select("body").append("svg").attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom).attr("class","svgborder");
var parentGroup = canvas.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var loop=0;
d3.csv("http://localhost:8080/mock1.csv")
  .row(function(d) { return { age: +d.Age,h:+d.Height,w:+d.Weight,pc:+d.pc};})
  .get(function(i,d) {
      console.log(d[0].age+" "+d[0].h+" "+d[0].w+" "+d[0].pc);
  console.log(d3.max(d3.extent(d,function(d){ return d.age})));
  console.log(d3.extent(d,function(d){ return d.pc}));
  /**var xTrans = d3.scaleLinear()
                 .domain([0,d3.max(d, function(d) { return d.h; })])//d.map(function(d) { return d.h; })
                 .range([0,width]);
  var yTrans = d3.scaleLinear()
                 .domain([0, d3.max(d, function(d) { return d.pc; })])
                 .range([height,0]);*/
                 var xTrans = d3.scaleLinear()
                                .domain([4,13])//d.map(function(d) { return d.h; })
                                .range([0,width]);
                 var yTrans = d3.scaleLinear()
                                .domain([0,100])
                                .range([height,0]);
                                /**var xScale = d3.scaleLinear()
                                               .domain([0,13])//d.map(function(d) { return d.h; })
                                               .range([0,width]);
                                var yScale = d3.scaleLinear()
                                               .domain([100,0])
                                               .range([height,0]);*/

  var xtickValues = d.map( function(t) { return t.age; });
  var ytickValues = d.map( function(t) { return t.pc; });

  //define axes
  var xAxis = d3.axisBottom(xTrans).tickValues(xtickValues);
  var yAxis = d3.axisLeft(yTrans).tickValues(ytickValues);
  console.log("Trabs"+xTrans(30));
  console.log("Trabs"+yTrans(30));
  parentGroup.append("g")
             .attr("class","xaxis")
             .attr("transform","translate(0,"+height+")")
             .call(xAxis)

  parentGroup.append("g")
             .attr("class","yaxis")
             .attr("transform", "rotate(-360)")
             .call(yAxis)

  var barGroups = parentGroup.selectAll("dataplots")
            .data(d)
            .enter()
            .append("g")
            .attr("class","dataplots")
console.log(d.length);
  var groupElements = barGroups
                      .append("rect")
                      .attr("x",function(d, i) {console.log("DATA"+50*i);return (100*i);})
                      .attr("y",function(d, i) {console.log(xTrans(d.h));return yTrans(d.pc)})
                      .attr("width",50-2)
                      .attr("height",function(d,i){
                      return (d.pc)})



  });//get end

function loadColumns(){}
