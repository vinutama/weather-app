const express = require('express');
const router = express.Router();
const WeatherController = require('../controllers/weather');

router.get("/:location", WeatherController.getWeatherbyLocation);

module.exports = router;