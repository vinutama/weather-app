const {getWeatherFromAPI, getWeatherFromCache, cacheWeatherData, parsingWeatherData} = require('../helpers');

module.exports = {
    getWeatherByLocationService: async (location) => {
        try {
            const cacheKey = `weather-${location}`;
            let weatherData;
            let fromCache = false;
            weatherData = await getWeatherFromCache(cacheKey);
            if (weatherData) {
                fromCache = true;
            }

            if (!fromCache) {
                weatherData = await getWeatherFromAPI(location);
                await cacheWeatherData(cacheKey, weatherData);
            }
            return parsingWeatherData(weatherData);
            
        } catch (err) {
            throw err;
        }
    },
}