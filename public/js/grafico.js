$(document).ready(function () {
  var legendas = $("#legendaProdutosGrafico").val();
  var legendasArray = legendas.split(",");
  var dataOn = $("#diarioProdutoGraficoOn").val();
  var dataOnArray = dataOn.split(",");
  var dataOff = $("#diarioProdutoGraficoOff").val();
  var dataOffArray = dataOff.split(",");

  console.log(dataOffArray);

  var datasets = [];
  datasets.push({
    label: "Valor",
    data: [1000, 2000, 2500, 4000],
    backgroundColor: "#1d5916",
  });
  datasets.push({
    label: "Quantidade",
    data: [220, 300, 305, 322],
    backgroundColor: "#ff8c00",
  });

  var ctx = document.getElementById("diarioProdutoGraficoImg");
  var diarioProdutoGraficoImg = new Chart(ctx, {
    type: "bar",
    data: {
      labels: legendasArray,
      datasets: datasets,
    },
    options: {
      tooltips: {
        displayColors: true,
        callbacks: {
          mode: "x",
        },
      },
      scales: {
        xAxes: [
          {
            stacked: true,
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
            type: "linear",
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: { position: "top" },
    },
  });
});
