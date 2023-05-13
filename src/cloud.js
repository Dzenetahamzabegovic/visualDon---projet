import data from "../data/DataKillers.csv";

// // prendre les donnes du fichier csv
const filteredData = data.map((d) => d["condamnation"]);
const res = filteredData.flatMap((d) => d.split(", "));
console.log(res);

const dataPrisonVie = res.filter((d) => d === "prison à vie").length;
console.log(dataPrisonVie); // 79 OK

const dataMortNaturelle = res.filter((d) => d === "mort naturelle").length;
console.log(dataMortNaturelle); // 27 IL MANQUE 2

const dataVivant = res.filter((d) => d == "vivant").length;
console.log(dataVivant); // 1 IL EN MANQUE 3

const dataNA = res.filter((d) => d == "N/A").length;
console.log(dataNA); // 76 OK - 5 MANQUANT

const dataSui = res.filter((d) => d == "suicide").length;
console.log(dataSui); // 21 C'EST OK

const dataExecution = res.filter((d) => d == "exécution").length;
console.log(dataExecution); // 62 - 3 manquant

const dataPM = res.filter((d) => d == "peine de mort").length;
console.log(dataPM); // 18 c'est ok
// // // // Compter le nombre d'occurences de chaque condamnation

// List of words
// remplace les tailles par les length de dataPrisonVie
// Données pour le wordcloud
var myWords = [
  { word: "Prison à vie", size: dataPrisonVie },
  { word: "Mort naturelle", size: dataMortNaturelle },
  { word: "Vivant", size: dataVivant * 3 },
  { word: "Aucune information", size: dataNA },
  { word: "Suicide", size: dataSui },
  { word: "Exécution", size: dataExecution },
  { word: "Peine de mort", size: dataPM },
];

// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 1200 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#chartCloud")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It runs an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
var layout = d3.layout
  .cloud()
  .size([width, height])
  .words(
    myWords.map(function (d) {
      return { text: d.word, size: d.size };
    })
  )
  .padding(15) // space between words
  .rotate(function () {
    return ~~(Math.random() * 2) * 25;
  })
  .fontSize(function (d) {
    return d.size;
  }) // font size of words
  .on("end", draw);

layout.start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
  svg
    .append("g")
    .attr(
      "transform",
      "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
    )
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style("font-size", function (d) {
      return d.size;
    })
    .style("fill", "black")
    .style("font-family", "vampliers")
    .style("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("transform", function (d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function (d) {
      return d.text;
    })
    // animation au survol
    .on("mouseover", function (d) {
      d3.select(this).style("font-size", "60px").style("cursor", "pointer");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("font-size", function (d) {
        return d.size + "px";
      });
    })

    .on("mouseover", function (d) {
      d3.select(this)
        .transition()
        .duration(500)
        .style("font-size", "60px")
        .style("cursor", "pointer");
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .transition()
        .duration(500)
        .style("font-size", function (d) {
          return d.size + "px";
        });
    });
}

svg.call(
  d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform);
  })
);
