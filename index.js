const ctx = document.getElementById("weatherChart").getContext("2d");
const data = [  // Placeholder for data, currently not used
    liveTemperature = "", 
    liveHumidity = ""   ]

const labels = ["00", "04", "08", "12", "16", "20", "24"];      // Tidspunkter på dagen (x-aksen)
const tempDataExample = [15.2, 14.7, 14.5, 15.1, 15.8, 15.5, 15.1];    //Temperatur
const humidityDataExample = [72, 76, 79, 74, 69, 71, 74];              // Luftfugtighed

const app = Vue.createApp({
    data() {
        return {
            temperatureData : [],
            humidityData : []
        }
    },
    methods: {
        GetTemperature(){
            axios.get(data.liveTemperature)
                .then(response => {
                    this.temperatureData = response.data;
                });
        },
        GetHumidity(){
            
        }
    }
})

const weatherChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Temperatur (°C)",
        data: tempDataExample,
        yAxisID: "yTemp",
        borderColor: "#d96b27",
        backgroundColor: "#d96b27",
        borderWidth: 2.5,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        label: "Luftfugtighed (%)",
        data: humidityDataExample,
        yAxisID: "yHum",
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        borderWidth: 2.5,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 5
      }
    ]
  },
  options: {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: {
        display: false // Vi bruger vores egne checkboxes øverst
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tidspunkt (timer)",
          color: "#333",
          font: {
            size: 13
          },
          padding: { top: 10 }
        },
        grid: {
          display: false
        }
      },
      yTemp: {
        type: "linear",
        position: "left",
        min: -5,
        max: 40,
        title: {
          display: true,
          text: "Temperatur (°C)",
          align: "start",
          color: "#333",
          font: {
            size: 13
          }
        },
        ticks: {
          stepSize: 2
        },
        grid: {
          color: "#e5e7eb"
        }
      },
      yHum: {
        type: "linear",
        position: "right",
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Luftfugtighed (%)",
          align: "end",
          color: "#333",
          font: {
            size: 13
          }
        },
        ticks: {
          stepSize: 10
        },
        grid: {
          drawOnChartArea: false // Undgår dobbelte vandrette gridlinjer
        }
      }
    }
  }
});

// Slå linjerne til og fra via checkboxes
document.getElementById("toggleTemp").addEventListener("change", (e) => {
  weatherChart.setDatasetVisibility(0, e.target.checked);
  weatherChart.update();
});

document.getElementById("toggleHum").addEventListener("change", (e) => {
  weatherChart.setDatasetVisibility(1, e.target.checked);
  weatherChart.update();
});