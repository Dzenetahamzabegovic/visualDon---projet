import data from "../data/DataKillers.csv";
import { json } from "d3-fetch";

// Récupération du bouton et du graphique
const bouton = document.getElementById("bouton_graphique");
const graphique = document.querySelector(".chart_picto");

// Gestionnaire d'événement pour le clic sur le bouton
bouton.addEventListener("click", () => {
  // Si le graphique est visible, on le cache, sinon on l'affiche
  if (graphique.style.display === "none") {
    graphique.style.display = "block";
  } else {
    graphique.style.display = "none";
  }
});

// Prenon le choix des victimes
const filteredData = data.map((d) => d["choix-des-victimes"]);
const res = filteredData.flatMap((d) => d.split(", "));
// Compter le nombre d'occurrences de chaque femmes
const countFemme = res.filter((d) => d === "femmes").length;
const countFemmeSpace = res.filter((d) => d === "femmes ").length;
const sumFemme = countFemme + countFemmeSpace;
// Compter le nombre d'occurrences de chaque hommes
const countHomme = res.filter((d) => d === "hommes").length;
// Compter le nombre d'occurrences de chaque enfant
const countEnfants = res.filter((d) => d === "enfants").length;
// Compter le nombre d'occurrences de chaque couple
const countCouples = res.filter((d) => d === "couples").length;
// Compter le nombre d'occurrences de chaque aléatoire
const countAleatoire = res.filter((d) => d === "aléatoire").length;
// Compter le nombre d'occurrences de chaque gays
const countGays = res.filter((d) => d === "homosexuels").length;
// Compter le nombre d'occurrences de chaque "N/A"
const countNA = res.filter((d) => d === "N/A").length;

// Créer un tableau avec les données et les étiquettes
const dataHisto = [
  { label: "Femmes", count: 15 },
  { label: "Hommes", count: 2 },
  { label: "Enfants", count: 8 },
  { label: "Couples", count: 0 },
  { label: "Aleatoire", count: 20 },
  { label: "Homosexuels", count: 1 },
  { label: "No comment", count: 0 },
];

const CountChoixVictime = dataHisto.length;
// compter le nombre de victimes au total
const VictimTotal = dataHisto.map((d) => d.count);
const dataVictimTotalCount = d3.sum(VictimTotal, function (d) {
  return d;
}); // 312

// Dimensions du graphique
const width = 1200;
const height = 700;
const margin = { top: 100, right: 20, bottom: 20, left: 20 };

// Création de l'élément SVG
const svg = d3
  .select(".chart_picto")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "#8B0000"); // Ajout du fond rouge;

// Création de l'échelle pour les valeurs
const xScale = d3
  .scaleLinear()
  .domain([0, 20]) // nombre de bonhomme sur la ligne
  .range([0, width - margin.left - margin.right]);

// Création des groupes pour chaque donnée
const groups = svg
  .selectAll("g")
  .data(dataHisto)
  .enter()
  .append("g")
  .attr(
    "transform",
    (d, i) => `translate(${margin.left}, ${i * 80 + margin.top})`
  )
  .attr("class", (d) => d.label);

// Répétition de l'image pour chaque donnée
groups
  .selectAll("image")
  .data((d) => d3.range(Math.min(d.count, 20)))
  .enter()
  .append("image")
  .attr("xlink:href", "../img/noun-person-2671551.svg")
  .attr("width", 50) // CHANGE LA TAILLE DES PICTOGRAMMES
  .attr("height", 50)
  .attr("x", (d, i) => xScale(i)); // Espacement horizontal des images

// Ajout du texte pour chaque donnée // typo pour les labels
groups
  .append("text")
  .attr("x", xScale(20))
  .attr("y", -9)
  .attr("text-anchor", "end")
  .text((d) => `${d.label} (${d.count})`)
  .style("font-size", "20px")
  .style("font-family", "vampliers");

// Ajout d'une ligne pour chaque donnée
groups
  .append("line")
  .attr("x1", xScale(0))
  .attr("y1", 40)
  .attr("x2", xScale(20))
  .attr("y2", 40)
  .attr("stroke", "black")
  .attr("stroke-width", 4);

// Ajout d'un titre
// svg
//   .append("text")
//   .attr("x", width / 2)
//   .attr("y", margin.top - 40)
//   .attr("text-anchor", "middle")
//   .text("Les choix de victimes")
//   .style("font-size", "45px") // taille titre
//   .style("font-family", "Help me");

//-------------------------------------------------NO
