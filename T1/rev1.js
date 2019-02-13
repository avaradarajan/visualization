var columns;
var yheight = 600;
var xwidth = 800;

//var margin = {top: 20, right: 160, bottom: 35, left: 30};
var margin = 200;
//Basically draw an inner board for plotting with margin boundaries
var width = 960 - margin,
height = 600 - margin;

//Create a canvas and a group element that will hold the bar graph
var canvas = d3.select("body").append("svg").attr("width",width + margin).attr("height",height + margin).attr("class","svgborder");


var loop=0;//looping through any array in the code
var numBins = 11;//number of bins/bars in the graph
var binSize = 0;//range of values bin can hold i.e binSize = 5 if it can hold 290-294 values
var xRanges = new Array(numBins).fill(0);//initialize an array with 0. This array is to define the range of values x Axis will be taking
var binArray = new Array(numBins).fill(0);//initialize an array with 0. This array is to define the count of values in each bin
var maxValue = 0;//min Value in the input
var minValue = 0;//max value in the input
var binWidth = width/(numBins);//calculate the width of the rect aka bar
var columnNames = [0]; //populate all the columnNames
var dropDownValue = "gre";
var chartSwitch = "bar";
//Load data from CSV hosted in http server
d3.csv("http://localhost:8080/Admission_Predict.csv")
.row(function(d) { return { gre: +d.gre,toefl: +d.toefl,ac:+d.admitchance};})//curate the type of data if needed as d3 returns all as string
.get(function(error,d) {//callback function that gets called when all the data is loaded in the variable d here.

  if(error){throw error;} //error handling

  columnNames = d.columns;//load all column names for dynamic loading of data
  loadColumns(); //Load the columns as a dropdown for user to select

  var inputArray = new Array(d.length).fill(0);
  d.forEach(function(data,i) {
    inputArray[i] = data[dropDownValue];
  })
  loadData(inputArray,dropDownValue);
  d3.select("#p1").on("change",function(inp){
    d.forEach(function(data,i) {
      dropDownValue = d3.select('#p1').property('value');
      inputArray[i] = data[dropDownValue];
    })
    loadData(inputArray,dropDownValue);
  })
});//get end


function loadData(d,val){
  //console.log(val+"GG");
  //console.log(typeof(+value);
  d3.selectAll("g").remove();
  binArray.fill(0);
  var parentGroup = canvas.append("g").attr("transform", "translate(" + 100 + "," + 70 + ")");
  maxValue = d3.max(d3.extent(d,function(d){ return d}));//get the max value from the array of GRE values in the input
  minValue = d3.min(d3.extent(d,function(d){ return d}));//get the min value from the array of GRE values in the input
  //console.log(maxValue);
  binSize = Math.ceil((maxValue - minValue)/numBins);//calculate the range of values bin can hold in each bucket
  //console.log("Bin Size "+binSize);

  //calculate the values to be listed in xAxis
  var min = minValue;
  var factor = Math.ceil((maxValue-minValue)/numBins);
  //console.log("If Min"+maxValue)
  for(loop=0;loop<xRanges.length;loop++)
  {
    xRanges[loop] = Math.floor((min+(min+factor))/2);
    min = min + factor;
    //console.log("XRange"+xRanges[loop]);
  }

  //loop through the input data and assign it to a bin and increment the count
  //Hash it into the 10 bins we have
  d.forEach(function(data,i) {
    //console.log("Here"+Math.floor((data-minValue)/binSize));
    binArray[Math.floor((data-minValue)/binSize)]++;
  })

  //Checking the array contents
  for(loop=0;loop<binArray.length;loop++)
  {
    console.log(binArray[loop]);
  }

  //calculating the max value of Y axis to define the Y-axis scale
  var maxValueForYAxis = d3.max(d3.extent(d,function(d,i){ return binArray[i]}));
  console.log("Max value for Y axis - "+maxValueForYAxis)
  //Data Ready after binning

  //X axis - GRE and Y-axis count
  var xScale = d3.scaleBand()
  .range([0,width]);
  var yScale = d3.scaleLinear()
  .range([height,0]);

  xScale.domain(xRanges); //provide values to the x axis
  yScale.domain([0, maxValueForYAxis+10]); // provide values for Y axis. Plus 10 adds one more tick to bound everything

  var yScaleValues = d3.scaleLinear().domain([maxValueForYAxis+10,0])
  .range([height,0]);

  //define axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale).tickFormat(function(d){ // You can return whatever text you want to display on range values for Y axis. Like $ 20
    return  d;
  }).tickSize(-width, 0, 0);

  //Append to the parent group i.e. html -> svg -> g (parentGroup)
  parentGroup.append("g")
  .attr("class","xaxis")
  .attr("transform","translate(0,"+height+")")
  .call(xAxis)
  .append("text")
  .attr("y", 40)
  .attr("x", 600)
  .attr("text-anchor", "end")
  .attr("stroke", "black")
  .text(dropDownValue.toUpperCase());

  //Append to the parent group i.e. html -> svg -> g (parentGroup)
  parentGroup.append("g")
  .attr("class","yaxis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "-4.1em")
  .attr("text-anchor", "end")
  .attr("stroke", "black")
  .text("COUNT");
  //Append to the parent group i.e. html -> svg -> g (parentGroup) and class as dataplots
  var barGroups = parentGroup.selectAll("dataplots")
  .data(binArray)
  .enter()
  .append("g")
  .attr("class","dataplots")

  //Append to the parent group i.e. html -> svg -> g (parentGroup)
  var groupElements = barGroups
  .append("rect")
  .attr("x",function(d, i) {return (binWidth*i);})
  .attr("y",function(d, i) {return height-yScaleValues(binArray[i])})
  .attr("width",binWidth-2)
  .attr("height",function(d,i){
    return yScaleValues(binArray[i])})
    .on("mouseover",function(inp){
      var newHeight = d3.select(this).node().getBoundingClientRect().height;
      //display value on top and increase width and decrease Height - I chose the decrease Height to ensure that the value it represents does not
      //change but still shrinks to show that it is highlighted
      d3.select(this).attr("fill","orange").transition().duration(400)
      .attr("width",function(d, i) {return binWidth-5})
      .attr("height",function(d,i){
       return newHeight - 5})
       parentGroup.append("text")
        .attr('class', 'val')
        .attr('x', function() {
            return d3.select(this).node().getBoundingClientRect().width;
        })
        .attr('y', function() {
            return d3.select(this).node().getBoundingClientRect().height + 102;
        })
        .text(function() {
            return "S";  // Value of the text
        });
    })
    .on("mouseout",function(inp){
      d3.selectAll('.val')
        .remove()
      var newHeight = d3.select(this).node().getBoundingClientRect().height;
      //display value on top and increase width and height
      d3.select(this).attr("fill","#402269").attr("width",function(d, i) {return binWidth-2})
      .attr("height",function(d,i){
      return newHeight + 5 })
    })


    //Clean if anything was added
    barGroups.exit().remove();


    //Pie code on clicking anywhere on the svg
    canvas.on("click",function(inp){
      if(chartSwitch=="bar")
      {
        chartSwitch = "pie";
        d3.selectAll("g").remove();

        var parentGroup = canvas.append("g").attr("transform", "translate(" + 450 + "," + 300 + ")");
        var radius = Math.min(width, height) / 2;
        var pie = d3.pie()
        .value(function(d) { return d; })(binArray);
        var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)
        .cornerRadius(5);

        var labelArc = d3.arc()
        .outerRadius(radius - 60)
        .innerRadius(radius - 60);

        var background = parentGroup.selectAll("path")
        .data(pie)
        .enter()
        .append("path")
        .style("fill", function(d,i){console.log("data"+d.value)
        return d3.color("hsl(230, 80%, " + d.value + "%)");
      })
      .attr("d",arc);
      var getAngle = function (d) {
        return (210 / Math.PI * (d.startAngle + d.endAngle) / 2 );//Customized function but Reference from - http://jsfiddle.net/2uT7F/ //180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90;
      };
      console.log(dropDownValue);
      parentGroup.selectAll("text").data(pie).enter().append("text").attr("transform", function(d) { console.log(d);return "translate(" + labelArc.centroid(d) + ")" +
      "rotate(" + getAngle(d) + ")"; })
      .text(function(d,i) { //If there is no count in bin don display label in Pie
        if(binArray[i]==0)return "";return xRanges[i]})
        .style("fill", "#ffffff")
        .attr("text-anchor", "middle")
        .attr("font-size","10px")

        parentGroup.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", -350)
        .attr("y", -220)
        .attr("font-size", "24px")
        .text("Pie Chart for :- "+dropDownValue.toUpperCase()+" (quantum represents the bin range)")


      }
      else {
        chartSwitch = "bar";
        loadData(d,dropDownValue);
      }
    })//end pie
  }


  function loadColumns(){
    console.log(columnNames);
    var selected = false;
    var select = document.getElementById("p1");
    for(index in columnNames) {
      if(columnNames[index] == "gre")//select by default
      selected = true;
      else
      selected = false;
      select.options[select.options.length] = new Option(columnNames[index].toUpperCase(), columnNames[index],selected,selected);
    }
  }
