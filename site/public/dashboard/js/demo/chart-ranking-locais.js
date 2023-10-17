// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

// Area Chart Example
var ctxRankingLocais = document.getElementById("graficoRankingLocais");
var graficoRankingLocais = new Chart(ctxRankingLocais, {
  type: "horizontalBar",
  data: {
    labels: ["Setor A", "Setor B", "Setor C", "Setor D", "Setor E"],
    datasets: [
      {
        label: "Quantidade de Incidentes",
        backgroundColor: [
          "#32bcad",
          "#32bcad",
          "#32bcad",
          "#32bcad",
          "#32bcad",
        ],
        borderColor: [
          "rgba(78, 115, 223, 1)",
          "rgba(78, 115, 223, 1)",
          "rgba(78, 115, 223, 1)",
          "rgba(78, 115, 223, 1)",
          "rgba(78, 115, 223, 1)",
        ],
        data: [15, 10, 12, 5, 20],
      },
    ],
  },
  options: {
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0,
      },
    },
    legend: {
      display: true,
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: "#6e707e",
      titleFontSize: 14,
      borderColor: "#dddfeb",
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: "index",
      caretPadding: 10,
    },
  },
});