import data from "../data/DataKillers.csv";
import { json } from "d3-fetch";
import rewind from "@turf/rewind";

//d3.select("body").style("background-color", "black");

// Extraction des pays
const paysData = data.map((d) => d.pays);
const res = paysData.flatMap((d) => d.split(",")).map((d) => d.trim());
const pays = [...new Set(res)];

const counts = {};
for (const p of res) {
  counts[p] = counts[p] ? counts[p] + 1 : 1;
}

const tueursParPays = pays.reduce((resultat, pays) => {
  // Initialiser l'objet pour ce pays
  resultat[pays] = {};
  // Trouver tous les tueurs pour ce pays
  const tueursPourPays = data.filter((d) =>
    d.pays
      .split(",")
      .map((p) => p.trim())
      .includes(pays)
  );
  // Ajouter les tueurs à l'objet pour ce pays
  tueursPourPays.reduce(
    (acc, { killers }) => ({
      ...acc,
      [killers.trim()]: (acc[killers.trim()] || 0) + 1,
    }),
    resultat[pays]
  );

  // Ajouter le nombre de tueurs pour ce pays
  resultat[pays].count = counts[pays] || 0;
  return resultat;
}, {});

const dataCarte = pays.map((pays) => {
  return {
    label: pays,
    count: tueursParPays[pays].count || 0,
    tueurs: tueursParPays[pays],
  };
});

console.log(dataCarte);

// Dimensions de la carte
// const width = window.innerWidth;
// const height = window.innerHeight;
// const scale = 250;

var margin = { top: 20, right: 10, bottom: 40, left: 100 },
  width = 1560 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;
const scale = 150;

// le
const map = d3
  .select("#mapWorld")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "black")
  .append("g");

var svg = d3
  .select("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*  // Ajouter un titre à la carte
map.append("text")
.text("...Le monde en sang...")
.attr("x", width / 4)
.attr("y", 60)
.attr("text-anchor", "middle")
.attr("fill", "#f53838")
.attr("font-size", "44px")
.style("font-family", "Help me");
*/

const projection = d3
  .geoMercator()
  .scale(scale)
  .center([0, 20])
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const maxCount = d3.max(dataCarte, (d) => d.count);
const colorScale = d3
  .scalePow()
  .exponent(0.2) // ajuste l'exposant pour la racine carrée ou 1 pour le logarithme
  .domain([0, maxCount])
  .range([d3.interpolateBlues(0.2), d3.interpolateReds(0.8)])
  .interpolate(d3.interpolateHcl);

// Créer une div pour afficher l'info box
const tooltip = d3.select(".tooltipCarte");

d3.json("data/world.geojson").then((data) => {
  // Changer le nom USA
  const index = dataCarte.map((d) => d.label).indexOf("United States");
  if (index !== -1) {
    dataCarte[index].label = "United States of America";
  }

  let fixed = data.features.map(function (feature) {
    return rewind(feature, { reverse: true });
  });
  // Mettre en place un compte à rebours pour l'affichage des couleurs de la carte
  let countDown = 2;
  const countDownEl = document.getElementById("countdown");
  countDownEl.innerHTML = countDown;

  const timer = setInterval(() => {
    countDown--;
    countDownEl.innerHTML = countDown;

    if (countDown <= 0) {
      // Dessiner la mapWorld
      const gMap = map.append("g");
      gMap
        .selectAll("path")
        .data(fixed)
        .join("path")
        .attr("d", path)
        .attr("fill", (d) => {
          let dataFiltered = dataCarte.find(
            (dc) => dc.label == d.properties.name
          );
          if (dataFiltered && dataFiltered.count) {
            // Vérifier si 'name' et 'count' existent
            return colorScale(dataFiltered.count);
          } else {
            return "white"; // pays sans répétitions
          }
        })
        // Ajouter l'animation de tremblement
        .on("mouseover", function (e, d) {
          d3.select(this)
            .transition()
            .duration(50)
            .attr("transform", "translate(2,2)")
            .transition()
            .duration(50)
            .attr("transform", "translate(-2,-2)")
            .transition()
            .duration(50)
            .attr("transform", "translate(2,-2)")
            .transition()
            .duration(50)
            .attr("transform", "translate(-2,2)")
            .transition()
            .duration(50)
            .attr("transform", "translate(0,0)");

          // Afficher l'info box
          tooltip.transition().duration(200).style("opacity", 0.9);
          console.log(d);
          tooltip
            .html(`${d.properties.name}`)
            .style("left", e.layerX + 10 + "px")
            .style("top", e.layerY - 28 + "px");
        })

        .on("mouseout", function (d) {
          // Rétablir l'opacité de l'élément survolé
          d3.select(this).style("opacity", 1);
          // Cacher l'info box
          tooltip.transition().duration(500).style("opacity", 0);
        });

      // Effacer le compte à rebours et le timer
      countDownEl.style.display = "none";
      clearInterval(timer);
    }
  }, 1000);
});
