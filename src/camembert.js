// Marges et translations
const margin = { top: 10, right: 40, bottom: 30, left: 40 },
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// Ajouter le svg
const monSvg = d3
  .select("#myDiv")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(
  "https://raw.githubusercontent.com/ZHB/switzerland-geojson/master/country/switzerland.geojson"
).then((data) => {
  // Rewind data : pas obligatoire si les données sont dessinées dans le bon ordre
  let fixed = data.features.map(function (feature) {
    return turf.rewind(feature, { reverse: true });
  });

  let projection = d3
    .geoMercator()
    .fitSize([width, height], { type: "FeatureCollection", features: fixed });

  let path = d3.geoPath().projection(projection);

  monSvg
    .selectAll("path")
    .data(fixed)
    .join((enter) =>
      enter
        .append("path")
        .attr("d", path)
        .attr("fill", "black")
        .attr("stroke-width", 1)
    );

  monSvg
    .append("circle")
    .attr("cx", projection([6.6412, 46.7785])[0])
    .attr("cy", projection([6.6412, 46.7785])[1])
    .attr("fill", "red")
    .attr("r", 3);
});
