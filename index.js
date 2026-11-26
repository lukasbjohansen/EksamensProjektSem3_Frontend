const baseUri = "http://localhost:5203/api/Measurements";

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
    chartLabels() {
      return this.sortedMeasurements.map((m) => this.formatTimeOnly(m.time));
    },
    chartTempData() {
      return this.sortedMeasurements.map((m) => m.temperature);
    },
    chartHumidityData() {
      return this.sortedMeasurements.map((m) => m.humidity);
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