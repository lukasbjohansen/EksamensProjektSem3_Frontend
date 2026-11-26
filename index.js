const baseUri = "https://measurementsapi9000-b4bsbph8awg2gya7.germanywestcentral-01.azurewebsites.net/api/measurements";

Vue.createApp({
  components: { WeatherChart },
  data() {
    return {
      measurements: [],
      latestMeasurement: null,
      error: null,
      polling: null
    };
  },
  computed: {
    sortedMeasurements() {
      return [...this.measurements].sort((a, b) => a.time - b.time);
    },
    chartStartTime() {
      const first = this.sortedMeasurements[0];
      return first ? this.toDate(first.time).getTime() : 0;
    },
    chartPoints() {
  return this.sortedMeasurements.map((m) => {
    const date = this.toDate(m.time);

    return {
      hour: date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600,
      temperature: m.temperature,
      humidity: m.humidity
    };
  });
},
chartTempData() {
  return this.chartPoints.map((point) => ({
    x: point.hour,
    y: point.temperature
  }));
},
chartHumidityData() {
  return this.chartPoints.map((point) => ({
    x: point.hour,
    y: point.humidity
  }));
}
  },
  async created() {
    await this.getLatestMeasurement();
    this.pollData();
  },
  beforeUnmount() {
    if (this.polling) {
      clearInterval(this.polling);
      this.polling = null;
    }
  },
  methods: {
    async getMeasurements(uri) {
      try {
        const response = await axios.get(uri);

        if (response.status === 204 || !response.data) {
          this.measurements = [];
        } else {
          this.measurements = response.data;
          this.measurements.forEach((measurement) => {
            measurement.Date = this.formatUnixTime(measurement.time);
          });
        }

        this.error = null;
      } catch (ex) {
        this.measurements = [];
        this.error = ex.message;
      }
    },
    async getLatestMeasurement() {
      await this.getMeasurements(baseUri);
      if (this.measurements.length < 1) {
        this.latestMeasurement = null;
        return;
      }
      this.latestMeasurement = this.sortedMeasurements[this.sortedMeasurements.length - 1];
    },
    pollData() {
      if (this.polling) return;

      this.polling = setInterval(async () => {
        await this.getLatestMeasurement();
      }, 3000);
    },
    toDate(unixTime) {
      const ms = unixTime < 1e12 ? unixTime * 1000 : unixTime;
      return new Date(ms);
    },
    formatTimeOnly(unixTime) {
      if (unixTime === null || unixTime === undefined) return "";
      const date = this.toDate(unixTime);
      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    },
    formatUnixTime(unixTime) {
      if (unixTime === null || unixTime === undefined) return "";

      const date = this.toDate(unixTime);
      const pad = (n) => String(n).padStart(2, "0");

      const day = pad(date.getDate());
      const month = pad(date.getMonth() + 1);
      const year = date.getFullYear();

      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());

      return `${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`;
    }
  }
}).mount("#app");