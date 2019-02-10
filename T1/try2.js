var columns;
var yheight = 600;
var xwidth = 800;

var margin = {top: 20, right: 160, bottom: 35, left: 30};
//Basically draw an inner board for plotting with margin boundaries
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//Create a canvas and a group element that will hold the bar graph
var canvas = d3.select("body").append("svg").attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom).attr("class","svgborder");
var parentGroup = canvas.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var loop=0;//looping through any array in the code
var numBins = 11;//number of bins/bars in the graph
var binSize = 0;//range of values bin can hold i.e binSize = 5 if it can hold 290-294 values
var xRanges = new Array(numBins).fill(0);//initialize an array with 0. This array is to define the range of values x Axis will be taking
var binArray = new Array(numBins).fill(0);//initialize an array with 0. This array is to define the count of values in each bin
var maxValue = 0;//min Value in the input
var minValue = 0;//max value in the input
var binWidth = width/(numBins);//calculate the width of the rect aka bar
var columnNames = [0]; //populate all the columnNames
//Load data from CSV hosted in http server
d3.csv("http://localhost:8080/Admission_Predict.csv")
  .row(function(d) { return { gre: +d.gre,ac:+d.admitchance};})//curate the type of data if needed as d3 returns all as string
  .get(function(error,d) {//callback function that gets called when all the data is loaded in the variable d here.

  if(error){throw error;} //error handling

  columnNames = d.columns;//load all column names for dynamic loading of data

  loadColumns(); //Load the columns as a dropdown for user to select
  
  maxValue = d3.max(d3.extent(d,function(d){ return d.gre}));//get the max value from the array of GRE values in the input
  minValue = d3.min(d3.extent(d,function(d){ return d.gre}));//get the min value from the array of GRE values in the input

  binSize = Math.ceil((maxValue - minValue)/numBins);//calculate the range of values bin can hold in each bucket
  console.log("Bin Size "+binSize);

  //calculate the values to be listed in xAxis
  var min = minValue;
  for(loop=0;loop<xRanges.length;loop++)
  {
    xRanges[loop] = (min+(min+4))/2;
    min = min + 5;
    console.log("XRange"+xRanges[loop]);
  }

  //loop through the input data and assign it to a bin and increment the count
  //Hash it into the 10 bins we have
  d.forEach(function(data,i) {
    //console.log(Math.floor((data.gre-minValue)/binSize));
    binArray[Math.floor((data.gre-minValue)/binSize)]++;
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
    });

  //Append to the parent group i.e. html -> svg -> g (parentGroup)
  parentGroup.append("g")
               .attr("class","xaxis")
               .attr("transform","translate(0,"+height+")")
               .call(xAxis)
  //Append to the parent group i.e. html -> svg -> g (parentGroup)
  parentGroup.append("g")
               .attr("class","yaxis")
               .call(yAxis)

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
                        .attr("width",binWidth-1)
                        .attr("height",function(d,i){
                        console.log(yScaleValues(binArray[i]));return yScaleValues(binArray[i])})

  //Clean if anything was added
  barGroups.exit().remove();



  });//get end

function loadColumns(){
  console.log(columnNames);

  var select = document.getElementById("p1");
  for(index in columnNames) {
      select.options[select.options.length] = new Option(columnNames[index], columnNames[index]);
  }

}
