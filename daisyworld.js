 var width = 500,
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
          else{return "blue";}
        })
        .attr("r", 5)
        .attr("transform", function(d) {
          var u = Math.random() + Math.random();
          var r;
          if(u>1){r = 2 - u;}
          else{r = u;}
          return "rotate(" + d/10 + ")" + "translate(" + (r * height / 2) + ",0)";
        });

d3.selectAll("circle").transition()
    .on("start", function repeat() {
        d3.active(this)
            .style("fill", function(d){
            current_color = d3.select(this).attr('fill');
            if (current_color == "black"){
              return "red";
            }
            else {return "yellow";}
          })
          .style("opacity", Math.random() > 0.5 ? 1 : 0)
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
var solar_luminosity = 0.8;//+(time*(1.2/200))
var death_rate = 0.3;

var counter = 1;

function daisy_change(frac_white, frac_black, frac_un){

  frac_un = 1 - frac_white - frac_black;
  //calculate albedo and planetary temp
  var albedo_planet = frac_un * albedo_un + frac_black * albedo_black + frac_white * albedo_white;
  var avg_planet_temp = ((solar_luminosity * solar_flux_constant * (1 - albedo_planet) / sb_constant) ** 0.25) - 273;

  function grow(frac, albedo_this){
    var local_temp = heat_absorp_fact * (albedo_planet - albedo_this)**2 + avg_planet_temp;
    var growth_factor = 1 - 0.003265 * (22.5 - local_temp)**2;
    var area_growth = frac * (frac_un * growth_factor - death_rate);

    return area_growth;
  }

  //calculate growth by color
  white_growth = grow(frac_white, albedo_white);
  black_growth = grow(frac_black, albedo_black);

  new_frac_white = Math.max(frac_white + white_growth + 0.001, 0);
  new_frac_black = Math.max(frac_black + black_growth + 0.001, 0);
  console.log("ROUND " + counter);
  console.log("Planet Temp: " + avg_planet_temp);
  console.log("White Growth: " + white_growth);
  console.log("Black Growth: " + black_growth);
  return growth = {"white": white_growth,
                   "black": black_growth};


}
