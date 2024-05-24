const axios = require('axios');

const API_KEY = process.env.WEATHER_API_KEY;
const API_URL = process.env.WEATHER_API_URL;
const { RedisClient } = require('./redis');

const getWeatherFromCache = async (cacheKey) => {
    const rclient = RedisClient();
    try {
        const cachedData = await rclient.get(cacheKey);
        return cachedData ? JSON.parse(cachedData) : null;
    } catch (err) {
        const prefixMsg = `Error while fetching weather data from cached`
        throw new Error(`${prefixMsg}: ${err}`);
    }
}

const getWeatherFromAPI = async (location) => {
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
        throw new Error(`${prefixMsg}: ${err}`);
    }
}

const cacheWeatherData = async (cacheKey, weatherData) => {
    const rclient = RedisClient();
    try {
        await rclient.setEx(cacheKey, 3600, JSON.stringify(weatherData));
    } catch (err) {
        const prefixMsg = `Error while try to caching weather data`;
        throw new Error(`${prefixMsg}: ${err}`);
    }
}

module.exports = {
    getWeatherByLocationService: async (location) => {
        try {
            const cacheKey = `weather-${location}`;

            const cachedWeatherData = await getWeatherFromCache(cacheKey);
            if (cachedWeatherData) {
                return cachedWeatherData;
            }

            const freshWeatherData = await getWeatherFromAPI(location);
            cacheWeatherData(cacheKey, freshWeatherData);

            return freshWeatherData;
            
        } catch (err) {
            throw err;
        }
    },
}