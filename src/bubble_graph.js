import data from "../data/DataKillers.csv";
// prenons les données de la colonne mode operatoire
const filteredData = data.map((d) => d["mode-operatoire"]);
const res = filteredData.flatMap((d) => d.split(", "));
console.log(res);

// combien de mode operatoire different
// console.log(res);

// Compter le nombre d'occurences de chaque mode opératoire
const dataNA = res.filter((d) => d == "N/A").length;
// 3 ok

const dataEnlevement = res.filter((d) => d == "enlèvement").length;
//10 no

const dataEnlevement2 = res.filter((d) => d == "enlevement").length;

const dataEnlevementcount = dataEnlevement + dataEnlevement2;

const dataMeurtre = res.filter((d) => d == "meurtre ").length;

const dataMeutre2 = res.filter((d) => d == "meurtre").length;

const datameutre3 = res.filter((d) => d == " meurtre").length;

const dataMeutrecount = dataMeurtre + dataMeutre2 + datameutre3;

const dataEvisceration = res.filter((d) => d == "éviscération").length;

const dataViol = res.filter((d) => d == "viol").length;

const dataStrangulation = res.filter((d) => d == "strangulation").length;

const dataCannibalisme = res.filter((d) => d == "cannibalisme").length;

const dataEmpoissonement = res.filter((d) => d == "empoisonnement").length;

const dataDemembrement = res.filter((d) => d == "démembrement").length;

const dataPoignardement = res.filter((d) => d == "poignardement").length;

const dataTorture = res.filter((d) => d == "torture").length;

var dataset = {
  children: [
    { label: "N/A", count: dataNA },
    { label: "Enlèvement", count: dataEnlevementcount },
    { label: "Meurtre", count: dataMeutrecount },
    { label: "Éviscération", count: dataEvisceration },
    { label: "Viol", count: dataViol },
    { label: "Strangulation", count: dataStrangulation },
    { label: "Cannibalisme", count: dataCannibalisme },
    { label: "Empoissonement", count: dataEmpoissonement },
    { label: "Démembrement", count: dataDemembrement },
    { label: "Poignardement", count: dataPoignardement },
    { label: "Torture", count: dataTorture },
  ].map(function (d) {
    return { label: d.label, count: d.count };
  }),
};

// dimensions
var diameter = 500;

// couleurs
var color = [
  " #ffcccc", // N/A
  "#FA8072", // Enlèvement
  "#b30000", // Meurtre = 275
  "#ffffff", // Éviscération
  "#e60000", // Viol
  "#ff6666", // Strangulation
  "#FA8072", // Cannibalisme
  "#ff8080", // Empoissonement
  "#8B0000", // Démembrement
  "#ffffff", // Poignardement
  "#ff6666", // Torture
];

// Création de l'objet d3.pack
var bubble = d3.pack().size([diameter, diameter]).padding(2.5); // padding = espace entre les bubbles

// Création de l'élément SVG
var svg = d3
  .select("#chart-balloon")
  .append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");

// Création de l'objet hierarchy
var nodes = d3.hierarchy(dataset).sum(function (d) {
  return d.count;
});
// Créer une div pour afficher l'info box
const tooltipBubble = d3.select("#tooltip");
// tooltipBubble.style("opacity", 0.9).style("opacity", 0);

// Création des noeuds
var node = svg
  .selectAll(".node")
  .data(bubble(nodes).descendants())
  .enter()
  .filter(function (d) {
    return !d.children;
  })
  .append("g")
  .attr("class", "node")
  .attr("transform", function (d) {
    return "translate(" + d.x + "," + d.y + ")";
  });

node
  .append("circle")
  .attr("r", function (d) {
    return d.r;
  })

  .style("fill", function (d, i) {
    return color[i];
  })

  // Ajouter des événements de souris pour afficher/masquer le tooltip
  .on("mouseover", function (e, d) {
    tooltipBubble.transition().duration(200).style("opacity", 0.9);
    tooltipBubble
      .html(d.data.label + "<br/>" + d.data.count + " cas")
      .style("left", e.layerX + "px")
      .style("top", e.layerY - 28 + "px");
  })
  .on("mouseout", function (d) {
    tooltipBubble.transition().duration(500).style("opacity", 0);
  });
