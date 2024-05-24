const {getWeatherFromAPI, getWeatherFromCache, cacheWeatherData} = require('../helpers');

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