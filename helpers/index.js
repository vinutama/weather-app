const { getRedisClient } = require('../services/redis');
const axios = require('axios');

const API_KEY = process.env.WEATHER_API_KEY;
const API_URL = process.env.WEATHER_API_URL;

// redis expires in 1 hour
const REDIS_TTL = 60 * 60;


module.exports = {
    getWeatherFromCache: async (cacheKey) => {
        const rclient = await getRedisClient();
        try {
            const cachedData = await rclient.get(cacheKey);
            return cachedData ? JSON.parse(cachedData) : null;
        } catch (err) {
            /* istanbul ignore next */
            const prefixMsg = `Error while fetching weather data from cached`
            /* istanbul ignore next */
            throw new Error(`${prefixMsg}: ${err}`);
        }
    },
    getWeatherFromAPI: async (location) => {
        try {
            const WEATHER_URL = `${API_URL}/${location}/today`;
            const reqQuery = {
                key: API_KEY,
                unitGroup: 'metric',
                contentType: 'json'
            };
            const response = await axios.get(WEATHER_URL, { params: reqQuery });

            return response.data;
        } catch (err) {
            const prefixMsg = `Error while fetching weather data from API`
            const errMsg = err.response.data;
            if (errMsg.includes("Invalid location")) {
                throw new Error(`${prefixMsg}: Inputted location does not exist!`);
            }
            /* istanbul ignore next */
            throw new Error(`${prefixMsg}: ${err}`);
        }
    },
    cacheWeatherData: async (cacheKey, weatherData) => {
        const rclient = await getRedisClient();
        try {
            await rclient.set(cacheKey, JSON.stringify(weatherData), {EX: REDIS_TTL});
        } catch (err) {
            /* istanbul ignore next */
            const prefixMsg = `Error while try to caching weather data`;
            /* istanbul ignore next */
            throw new Error(`${prefixMsg}: ${err}`);
        }
    },
    parsingWeatherData: (data) => {
        const keysToMap = {
            currentConditions: "currentWeather",
            address: "location",
            resolveAddress: "locationDetail",
            timezone: "timezone",
            latitude: "latitude",
            longitude: "longitude",
            days: "days",
        }
        const result = Object.entries(keysToMap).reduce((acc, [key, mapKey]) => {
            if (data.hasOwnProperty(key)) {
                if (key === "days") {
                    acc["hourlyWeather"] = data[key][0].hours;
                    acc["todayWeatherSummary"] = data[key][0].description;
                } else {
                    acc[mapKey] = data[key];
                }
            }
            return acc;
        }, {})

        return result;
    }
};