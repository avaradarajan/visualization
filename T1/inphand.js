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

//Load data from CSV hosted in http server
d3.csv("http://localhost:8080/Admission_Predict.csv")
  .row(function(d) { return { gre: +d.gre,toefl: +d.toefl,ac:+d.admitchance};})//curate the type of data if needed as d3 returns all as string
  .get(function(error,d) {//callback function that gets called when all the data is loaded in the variable d here.
    d.forEach(function(data,i) {
      console.log(data["gre"]+"ss");})
  if(error){throw error;} //error handling
  //console.log(d['gre']);
  columnNames = d.columns;//load all column names for dynamic loading of data
  //console.log("gg"+d)
  var da = new Array(d.length).fill(0);
  da = d.map(function(data){return +data.gre});
  //console.log(da)

  loadColumns(); //Load the columns as a dropdown for user to select
  d3.select("#p1").on("change",function(data){loadData(d,d3.select('#p1').property('value'));})

});
function loadColumns(){
  console.log(columnNames);
  var selected = false;
  var select = document.getElementById("p1");
  for(index in columnNames) {
      if(columnNames[index] == "gre")//select by default
        selected = true;
      else
        selected = false;
      select.options[select.options.length] = new Option(columnNames[index], columnNames[index],selected,selected);
  }
}
function loadData(d,value){
  console.log(d[gre]);
  console.log("d."+d3.event.target.value);
}
