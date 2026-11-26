const WeatherChart = {
  props: {
    labels: {
      type: Array,
      default: () => ["00", "04", "08", "12", "16", "20", "24"]
    },
    tempData: {
      type: Array,
      required: true
    },
    humidityData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showTemp: true,
      showHum: true,
      chart: null
    };
  },
  template: `
    <div class="weather-chart">
      <div class="controls">
        <label><input type="checkbox" v-model="showTemp"> Temperatur (°C)</label>
        <label><input type="checkbox" v-model="showHum"> Luftfugtighed (%)</label>
      </div>
      <canvas ref="canvas"></canvas>
    </div>
  `,
  mounted() {
    this.chart = new Chart(this.$refs.canvas, {
      type: "line",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "Temperatur (°C)",
            data: this.tempData,
            yAxisID: "yTemp",
            borderColor: "#d96b27",
            hidden: !this.showTemp
          },
          {
            label: "Luftfugtighed (%)",
            data: this.humidityData,
            yAxisID: "yHum",
            borderColor: "#2563eb",
            hidden: !this.showHum
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          yTemp: { position: "left", min: -5, max: 40 },
          yHum: { position: "right", min: 0, max: 100, grid: { drawOnChartArea: false } }
        }
      }
    });
  },
  watch: {
    showTemp(val) {
      this.chart.setDatasetVisibility(0, val);
      this.chart.update();
    },
    showHum(val) {
      this.chart.setDatasetVisibility(1, val);
      this.chart.update();
    },
    tempData(val) {
      this.chart.data.datasets[0].data = val;
      this.chart.update();
    },
    humidityData(val) {
      this.chart.data.datasets[1].data = val;
      this.chart.update();
    },
    labels(val) {
      this.chart.data.labels = val;
      this.chart.update();
    }
  }
};