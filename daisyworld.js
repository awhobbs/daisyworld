 var width = 960,
    height = 500;
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var daisies = svg.selectAll("circle")
        .data(d3.range(3600))
      .enter().append("circle")
        .attr("fill", function (){
          if(Math.random()>0.5){return "black";}
          else{return "pink";}
        })
        .attr("r", 5)
        .attr("transform", function(d) {
          var u = Math.random() + Math.random();
          var r;
          if(u>1){r = 2 - u;}
          else{r = u;}
          return "rotate(" + d/10 + ")" + "translate(" + (r * height / 2) + ",0)";
        });


  daisies.transition()
    .delay(function(d, i) { return Math.random(); })
    .on("start", function repeat() {
        d3.active(this)
            .style("fill", function(d){
              if(Math.random()>0.7){
                return "black";
              }
              else{
                return "pink";
              }
            })
            .attr('opacity', function(d){
              if(Math.random()>0.3 & Math.random()<0.7){
              return 1;
            }
            else{
              return 0;
            }
          })
          .duration(5000)

          .transition()
            .on("start", repeat);
      });

var albedo_un = 0.5;
var albedo_black = 0.25;
var albedo_white = 0.75;
var heat_absorp_fact = 20;
var sb_constant = 5.669e-8; // Stefan-Boltzman Constant (idk wtf that is)
var solar_flux_constant = 917;
var solar_luminosity = 0.6;//+(time*(1.2/200))
var death_rate = 0.3;

function daisy_change(frac_white, frac_black, frac_un){
  var albedo_planet = frac_un * albedo_un + frac_black * albedo_black + frac_white * albedo_white;
  var avg_planet_temp = ((solar_luminosity * solar_flux_constant * (1 - albedo_planet) / sb_constant)^.25) - 273;
  console.log("White Daisies: " + grow(frac_white)[0] + ", " + grow(frac_white)[1]);
  console.log("Dark Daisies: " + grow(frac_black)[0] + ", " + grow(frac_black)[1]);
  function grow(frac, albedo_this){
    var local_temp = heat_absorp_fact * (albedo_planet - albedo_this)^2 + avg_planet_temp;
    var growth_factor = 1 - 0.003265 * (22.5 - local_temp)^2;
    var growth = frac * frac_un + .001;
    var death = frac * death_rate;
    return [growth, death];
  }
}
