const { RedisClient } = require('../services/redis');
const axios = require('axios');

const API_KEY = process.env.WEATHER_API_KEY;
const API_URL = process.env.WEATHER_API_URL;


module.exports = {
    getWeatherFromCache: async (cacheKey) => {
        const rclient = RedisClient();
        try {
            const cachedData = await rclient.get(cacheKey);
            return cachedData ? JSON.parse(cachedData) : null;
        } catch (err) {
            const prefixMsg = `Error while fetching weather data from cached`
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
            console.log(response, "RESPONSE");

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
                const data = response.data;
                console.log(mapKey, "MAPKEY??");
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
            
        } catch (err) {
            const prefixMsg = `Error while fetching weather data from API`
            const errMsg = err.response.data;
            if (errMsg.includes("Invalid location")) {
                throw new Error(`${prefixMsg}: Inputted location does not exist!`);
            }
            throw new Error(`${prefixMsg}: ${err}`);
        }
    },
    cacheWeatherData: async (cacheKey, weatherData) => {
        const rclient = RedisClient();
        try {
            await rclient.setEx(cacheKey, 3600, JSON.stringify(weatherData));
        } catch (err) {
            const prefixMsg = `Error while try to caching weather data`;
            throw new Error(`${prefixMsg}: ${err}`);
        }
    }
};