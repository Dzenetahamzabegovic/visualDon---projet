import data from "../data/DataKillers.csv";

// construire le camembert
// créer un canevas de 400 pixels de large sur 400 pixels de haut
// un cercle de rayon 200 pixels centré dans le canevas
const width = 700,
  height = 500,
  radius = Math.min(width, height) / 2;

const myColors = ["#8B0000", "##f53838"];
const colors = d3.scaleOrdinal().range(myColors);

// charger les donnees
// Prenon les victimes possibles/prouvées
const filteredDataProuvee = data.map((d) => d["victimes-prouvees"]);
const filteredDataPossible = data.map((d) => d["victimes-possibles"]);

console.log(filteredDataProuvee);
console.log(filteredDataPossible);

// Compter le nombre d'occurrences de chaque victime prouvée
let victimeProuveeCount = d3.sum(filteredDataProuvee, function (d) {
  return d;
});

// Compter le nombre d'occurrences de chaque victime possible
let victimePossibleCount = d3.sum(filteredDataPossible, function (d) {
  return d;
});

console.log(victimeProuveeCount);
console.log(victimePossibleCount);

// Fusionner les deux compteurs en un seul tableau
// let dataCount = [
//   { label: "Victimes prouvées", value: victimeProuveeCount },
//   { label: "Victimes possibles", value: victimePossibleCount },
// ];

// Créer un tableau avec les données et les étiquettes
const dataCamembert = [
  { label: "Victimes prouvées", count: victimeProuveeCount },
  { label: "Victimes possibles", count: victimePossibleCount },
];

// Créer l'élément SVG dans le corps du document
const svg = d3
  .select("#camembert")
  .append("svg")
  .attr("width", 700)
  .attr("height", 700);
// Créer un groupe pour le camembert centré dans le canevas
const g = svg
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Créer un arc pour chaque tranche du camembert
const arc = d3.arc().innerRadius(0).outerRadius(radius);

// Créer une fonction pour calculer les angles des arcs en fonction des données
const pie = d3
  .pie()
  .sort(null)
  .value(function (d) {
    return d.count;
  });

// Ajouter les tranches du camembert
const path = g
  .selectAll("path")
  .data(pie(dataCamembert))
  .enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", function (d, i) {
    return colors(i);
  })

  // animation
  .transition()
  .duration(5000)
  .attrTween("d", function (d) {
    var i = d3.interpolate(d.startAngle, d.endAngle);
    return function (t) {
      d.endAngle = i(t);
      return arc(d);
    };
  });

// Créer un tableau avec les étiquettes
const labels = ["Victimes prouvées", "Victimes possibles"];

// const text = g
//   .selectAll("text")
//   .data(pie(dataCamembert))
//   .enter()
//   .append("text")
//   .attr("class", "legend")
//   .style("fill", "white")
//   .style("font-size", "20px")
//   .style("margin-top", "20px")
//   .attr("transform", function (d) {
//     var c = arc.centroid(d);
//     return "translate(" + c[0] + "," + c[1] + ")";
//   })
//   .attr("dy", ".35em")
//   .text(function (d) {
//     return d.data.label;
//   });
const text = g
  .selectAll("text")
  .data(pie(dataCamembert))
  .enter()
  .append("text")
  .attr("class", "legend")
  .style("fill", "white")
  .style("font-size", "20px")
  .style("margin-top", "20px")
  .attr("transform", function (d) {
    var c = arc.centroid(d);
    return "translate(" + c[0] + "," + c[1] + ")";
  })
  .attr("dy", ".35em")
  .text(function (d, i) {
    return i === 0 ? "Victimes possibles" : "Victimes prouvées";
  });
