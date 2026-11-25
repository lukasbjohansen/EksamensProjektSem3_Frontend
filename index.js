const baseUri = "http://localhost:5203/api/Measurements";
const app = Vue.createApp({
    data() {
        return {
            measurements: [],
            latestMeasurement: null,
            error: null,
            polling: null
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
                    this.measurements = response.data
                    this.measurements.forEach(measurement => {
                        measurement.Date = this.formatUnixTime(measurement.time)
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
            let latest = this.measurements[0];
            for (const measurement of this.measurements) {
                if (measurement.time > latest.time) {
                    latest = measurement;
                }
            }
            this.latestMeasurement = latest;
        },
        pollData() {
            if (this.polling) return;

            this.polling = setInterval(async () => {
                await this.getLatestMeasurement();
            }, 3000);
        },
        formatUnixTime(unixTime) {
            if (unixTime === null || unixTime === undefined) return "";

            const ms = unixTime < 1e12 ? unixTime * 1000 : unixTime;
            const date = new Date(ms);

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
}).mount('#app')