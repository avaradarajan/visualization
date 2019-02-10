var columns;
var yheight = 600;
var xwidth = 800;
var binWidth = 50;
var canvas = d3.select("body").append("svg").attr("width","800").attr("height","600").attr("class","svgborder");

var data = d3.csv("http://localhost:8080/MOCK_DATA.csv")
             .row(function(d) { return { age: +d.Age,h:+d.Height,w:+d.Weight};})
             .get(function(i,d) {  columns = d.columns;console.log(d[0].age);
              var i;
              for (i = 0; i < 10; i++) {
              //console.log("ss"+d[i].h);
              var group = canvas.selectAll("g")
                        .data(d)
                        .enter()
                        .append("g")
                        .attr("transform", function(d, i) {
                              return "translate(" + i * binWidth + ",0)";
                        });
              group.append("rect").attr("y",function(d, i) {return 600 - (d.h*2)}).attr("x",function(d, i) {return (i+5)}).attr("width", 50)
                                   .attr("height", function(d,i){//console.log(d.h+""+i);
                                   return d.h*2})
                                   //.attr("transform", "rotate(-90)");

            }
            });

//Called for each dataset row
function createBarChart(d){
  d.forEach(function(d,i) {
    //Code for bar chart
    console.log("ss"+d[0].cgpa);
    canvas.selectAll("rect").data(d).enter().append("rect").attr("x", 10)
                         .attr("y", 10)
                         .attr("width", 50)
                         .attr("height", d.cgpa);
    call2();
  })}

function call2(){
  //console.log("here2");
}

//var bar = canvas.append("rect").attr("")
function loadColumns(){
var select = document.getElementById("p1");
for(index in columns) {
    select.options[select.options.length] = new Option(columns[index], columns[index]);
}
}

d3.selectAll('select')
  .on('click', function(d, i) {
    //lert();
    if(document.getElementById("p1").value == "CGPA")
    document.getElementsByClassName("svgborder")[0].style.backgroundColor = "black";
  });

  var selectmenu=document.getElementById("p1")
  selectmenu.onchange=function(){ //run some code when "onchange" event fires
  if(document.getElementById("p1").value == "Height"){
  document.getElementsByClassName("svgborder")[0].style.backgroundColor = "steelblue";
  canvas.selectAll("g").remove();
  d3.csv("http://localhost:8080/MOCK_DATA.csv")
               .row(function(d) { return { age: +d.Age,h:+d.Height,w:+d.Weight};})
               .get(function(i,d) {  columns = d.columns;console.log(d[0].age);
                var i;
                for (i = 0; i < 10; i++) {
                console.log("ss"+d[i].w);
                var group = canvas.selectAll("g")
                          .data(d)
                          .enter()
                          .append("g")
                          .attr("transform", function(d, i) {
                                return "translate(" + i * binWidth + ",0)";
                          });
                group.append("rect").attr("y",function(d, i) {return 600 - (d.w*2)}).attr("x",function(d, i) {return (i+5)}).attr("width", 50)
                                     .attr("height", function(d,i){return d.w*2})
                                     //.attr("transform", "rotate(-90)");

              }
              });

  }
  else if(document.getElementById("p1").value == "Age"){
  document.getElementsByClassName("svgborder")[0].style.backgroundColor = "grey";
  canvas.selectAll("g").remove();
  d3.csv("http://localhost:8080/MOCK_DATA.csv")
               .row(function(d) { return { age: +d.Age,h:+d.Height,w:+d.Weight};})
               .get(function(i,d) {  columns = d.columns;console.log(d[0].age);
                var i;
                for (i = 0; i < 10; i++) {
                //console.log("ss"+d[i].h);
                var group = canvas.selectAll("g")
                          .data(d)
                          .enter()
                          .append("g")
                          .attr("transform", function(d, i) {
                                return "translate(" + i * binWidth + ",0)";
                          });
                group.append("rect").attr("y",function(d, i) {return 600 - (d.h*2)}).attr("x",function(d, i) {return (i+5)}).attr("width", 50)
                                     .attr("height", function(d,i){//console.log(d.h+""+i);
                                     return d.h*2})
                                     //.attr("transform", "rotate(-90)");

              }
              });


}
  else if(document.getElementById("p1").value == "Weight"){
  document.getElementsByClassName("svgborder")[0].style.backgroundColor = "powderblue";
  canvas.selectAll("g").remove();

}
  }
