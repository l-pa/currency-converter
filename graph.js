var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 3
      }
    ]
  },
  options: {
    scales: {
      xAxes: [
        {
          type: "time",
          distribution: "linear",
          bounds: "ticks",
          time: {
            unit: "day"
          },
          ticks: {
            callback: function(tick, index, array) {
              return index % 4 ? "" : tick;
            }
          }
        }
      ],
      yAxes: []
    }
  }
});
