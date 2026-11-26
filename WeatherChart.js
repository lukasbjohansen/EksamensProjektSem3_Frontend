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
      showHum: true
    };
  },
  template: `
    <div class="weather-chart">
      <div class="controls">
        <label><input type="checkbox" v-model="showTemp"> Temperatur (°C)</label>
        <label><input type="checkbox" v-model="showHum"> Luftfugtighed (%)</label>
      </div>
      <div class="axis-headings">
        <span class="y-axis-heading y-temp">Temperatur (°C)</span>
        <span class="y-axis-heading y-hum">Luftfugtighed (%)</span>
      </div>
      <canvas ref="canvas"></canvas>
    </div>
  `,
  mounted() {
    const chart = new Chart(this.$refs.canvas, {
      type: "line",
      data: {
        labels: [...this.labels],
        datasets: [
          {
            label: "Temperatur (°C)",
            data: [...this.tempData],
            yAxisID: "yTemp",
            borderColor: "#d96b27",
            hidden: !this.showTemp
          },
          {
            label: "Luftfugtighed (%)",
            data: [...this.humidityData],
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
          yTemp: { position: "left", min: -10, max: 50, ticks:{stepSize: 5, callback: (value) => value <= 45 && value >= -5 ? value : ""} },
          yHum: { position: "right", min: -10, max: 110, ticks:{stepSize: 5, callback: (value) => value <= 100 && value >= 0 ? value : ""} },
          
        }
      }
    });

    this.chart = Vue.markRaw(chart);
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  },
  watch: {
    showTemp(val) {
      if (!this.chart) return;
      this.chart.setDatasetVisibility(0, val);
      this.chart.update();
    },
    showHum(val) {
      if (!this.chart) return;
      this.chart.setDatasetVisibility(1, val);
      this.chart.update();
    },
    tempData: {
      deep: true,
      handler(val) {
        if (!this.chart) return;
        this.chart.data.datasets[0].data = [...val];
        this.chart.update();
      }
    },
    humidityData: {
      deep: true,
      handler(val) {
        if (!this.chart) return;
        this.chart.data.datasets[1].data = [...val];
        this.chart.update();
      }
    },
    labels: {
      deep: true,
      handler(val) {
        if (!this.chart) return;
        this.chart.data.labels = [...val];
        this.chart.update();
      }
    }
  }
};