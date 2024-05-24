const { getWeatherByLocationService } = require('../services/weather');

module.exports = {
    getWeatherbyLocation: async (req, res) => {
        try {
            const location = req.params.location;
            const weatherData = await getWeatherByLocationService(location);
            return res.status(200).json({ message: `Weather on location ${location} retrieved`, data: weatherData});
        } catch (err) {
            const errMsg = err.message;
            if (errMsg.includes("Inputted location does not exist")) {
                return res.status(400).json({error: err.message});
            }
            return res.status(500).json({error: err.message});
        }
    }
}