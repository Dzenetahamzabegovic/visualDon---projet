import data from "../data/DataKillers.csv";

// construire le camembert
// créer un canevas de 400 pixels de large sur 400 pixels de haut
// un cercle de rayon 200 pixels centré dans le canevas
const width = 800,
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
  .attr("width", width)
  .attr("height", height);
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

// ----------------- LEGENDES ----------------- //
// select the svg area
var Svg = d3.select("#legendBox");

// LABELS QUI VONT ETRE AFFICHéES
var keys = ["victimes-prouvees", "victimes-possibles"];

// Usually you have a color scale in your chart already
var color = d3.scaleOrdinal().range(myColors);

// AJOUT D'UN ROND POUR LES LEGENDES
Svg.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
  .attr("cx", 100)
  .attr("cy", function (d, i) {
    return 100 + i * 25;
  }) // 100 is where the first dot appears. 25 is the distance between dots
  .attr("r", 7)
  .style("fill", function (d) {
    return color(d);
  });

// AJOUTER DES LABELS POUR CHAAUQE RONDS
Svg.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
  .attr("x", 120)
  .attr("y", function (d, i) {
    return 100 + i * 25;
  }) // 100 is where the first dot appears. 25 is the distance between dots
  .style("fill", function (d) {
    return color(d);
  })
  .text(function (d) {
    return d;
  })
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle");

// Créer un tableau avec les étiquettes
const labels = ["Victimes prouvées", "Victimes possibles"];

// Ajouter des cercles pour chaque étiquette
const legend = svg
  .selectAll(".legend")
  .style("margin-left", "100px")
  .data(labels)
  .enter()
  .append("g")
  .attr("class", "legend")
  .attr("transform", function (d, i) {
    return "translate(-50," + (i - 1) * 25 + ")";
  });

legend
  .append("circle")
  .attr("cx", width - 220)
  .attr("cy", height - 460)
  .attr("r", 10)
  .style("fill", function (d, i) {
    return colors(i);
  });

// Ajouter du texte pour chaque étiquette
legend
  .append("text")
  .attr("x", width - 200)
  .attr("y", height - 460)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function (d) {
    return d;
  });
