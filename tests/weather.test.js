
const request = require('supertest');
const axios = require('axios');
const redis = require('redis');
const app = require('../app');

jest.mock('axios');
// mock the redis function
jest.mock('redis', () => ({
    createClient: jest.fn().mockReturnValue({
      on: jest.fn(),
      connect: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
    }),
  }));



describe('weather API test', () => {
    const location = 'London';

    const londonData = {
        "queryCost": 1,
        "latitude": 51.5064,
        "longitude": -0.12721,
        "resolvedAddress": "London, England, United Kingdom",
        "address": "London",
        "timezone": "Europe/London",
        "tzoffset": 1.0,
        "days": [
            {
                "datetime": "2024-05-24",
                "datetimeEpoch": 1716505200,
                "tempmax": 18.6,
                "tempmin": 10.5,
                "temp": 14.4,
                "feelslikemax": 18.6,
                "feelslikemin": 10.5,
                "feelslike": 14.4,
                "dew": 7.1,
                "humidity": 62.6,
                "precip": 0.0,
                "precipprob": 3.2,
                "precipcover": 0.0,
                "preciptype": [
                    "rain"
                ],
                "snow": 0.0,
                "snowdepth": 0.0,
                "windgust": 25.6,
                "windspeed": 14.0,
                "winddir": 248.5,
                "pressure": 1018.1,
                "cloudcover": 71.6,
                "visibility": 12.9,
                "solarradiation": 189.1,
                "solarenergy": 16.4,
                "uvindex": 10.0,
                "severerisk": 10.0,
                "sunrise": "04:56:25",
                "sunriseEpoch": 1716522985,
                "sunset": "20:59:19",
                "sunsetEpoch": 1716580759,
                "moonphase": 0.53,
                "conditions": "Partially cloudy",
                "description": "Partly cloudy throughout the day.",
                "icon": "partly-cloudy-day",
                "stations": [
                    "EGWU",
                    "EGLL",
                    "D5621",
                    "EGLC"
                ],
                "source": "comb",
                "hours": [
                    {
                        "datetime": "00:00:00",
                        "datetimeEpoch": 1716505200,
                        "temp": 12.6,
                        "feelslike": 12.6,
                        "humidity": 67.67,
                        "dew": 6.7,
                        "precip": 0.0,
                        "precipprob": 0.0,
                        "snow": 0.0,
                        "snowdepth": 0.0,
                        "preciptype": null,
                        "windgust": 12.6,
                        "windspeed": 14.0,
                        "winddir": 278.0,
                        "pressure": 1016.8,
                        "visibility": 10.0,
                        "cloudcover": 94.5,
                        "solarradiation": 0.0,
                        "solarenergy": 0.0,
                        "uvindex": 0.0,
                        "severerisk": 10.0,
                        "conditions": "Overcast",
                        "icon": "cloudy",
                        "stations": [
                            "EGWU",
                            "EGLL",
                            "D5621",
                            "EGLC"
                        ],
                        "source": "obs"
                    },
                    {
                        "datetime": "01:00:00",
                        "datetimeEpoch": 1716508800,
                        "temp": 12.0,
                        "feelslike": 12.0,
                        "humidity": 66.71,
                        "dew": 6.0,
                        "precip": 0.0,
                        "precipprob": 0.0,
                        "snow": 0.0,
                        "snowdepth": 0.0,
                        "preciptype": null,
                        "windgust": 15.8,
                        "windspeed": 12.2,
                        "winddir": 254.0,
                        "pressure": 1016.8,
                        "visibility": 10.0,
                        "cloudcover": 100.0,
                        "solarradiation": 0.0,
                        "solarenergy": 0.0,
                        "uvindex": 0.0,
                        "severerisk": 10.0,
                        "conditions": "Overcast",
                        "icon": "cloudy",
                        "stations": [
                            "EGWU",
                            "EGLL",
                            "D5621",
                            "EGLC"
                        ],
                        "source": "obs"
                    },
                ]
            }
        ],
        "currentConditions": {
            "datetime": "18:21:00",
            "datetimeEpoch": 1716571260,
            "temp": 17.8,
            "feelslike": 17.8,
            "humidity": 55.9,
            "dew": 8.9,
            "precip": 0.0,
            "precipprob": 0.0,
            "snow": 0.0,
            "snowdepth": 0.0,
            "preciptype": null,
            "windgust": 4.7,
            "windspeed": 5.8,
            "winddir": 71.0,
            "pressure": 1018.0,
            "visibility": 10.0,
            "cloudcover": 88.0,
            "solarradiation": 85.0,
            "solarenergy": 0.3,
            "uvindex": 1.0,
            "conditions": "Partially cloudy",
            "icon": "partly-cloudy-day",
            "stations": [
                "D5621",
                "F6665",
                "EGLC"
            ],
            "source": "obs",
            "sunrise": "04:56:25",
            "sunriseEpoch": 1716522985,
            "sunset": "20:59:19",
            "sunsetEpoch": 1716580759,
            "moonphase": 0.53
        }
    }
    const parsedWeatherData = {
        currentWeather: {
            datetime: '18:21:00',
            datetimeEpoch: 1716571260,
            temp: 17.8,
            feelslike: 17.8,
            humidity: 55.9,
            dew: 8.9,
            precip: 0,
            precipprob: 0,
            snow: 0,
            snowdepth: 0,
            preciptype: null,
            windgust: 4.7,
            windspeed: 5.8,
            winddir: 71,
            pressure: 1018,
            visibility: 10,
            cloudcover: 88,
            solarradiation: 85,
            solarenergy: 0.3,
            uvindex: 1,
            conditions: 'Partially cloudy',
            icon: 'partly-cloudy-day',
            stations: [ 'D5621', 'F6665', 'EGLC' ],
            source: 'obs',
            sunrise: '04:56:25',
            sunriseEpoch: 1716522985,
            sunset: '20:59:19',
            sunsetEpoch: 1716580759,
            moonphase: 0.53
        },
        location: 'London',
        timezone: 'Europe/London',
        locationDetail: "London, England, United Kingdom",
        latitude: 51.5064,
        longitude: -0.12721,
        hourlyWeather: [
            {
                "datetime": "00:00:00",
                "datetimeEpoch": 1716505200,
                "temp": 12.6,
                "feelslike": 12.6,
                "humidity": 67.67,
                "dew": 6.7,
                "precip": 0.0,
                "precipprob": 0.0,
                "snow": 0.0,
                "snowdepth": 0.0,
                "preciptype": null,
                "windgust": 12.6,
                "windspeed": 14.0,
                "winddir": 278.0,
                "pressure": 1016.8,
                "visibility": 10.0,
                "cloudcover": 94.5,
                "solarradiation": 0.0,
                "solarenergy": 0.0,
                "uvindex": 0.0,
                "severerisk": 10.0,
                "conditions": "Overcast",
                "icon": "cloudy",
                "stations": [
                    "EGWU",
                    "EGLL",
                    "D5621",
                    "EGLC"
                ],
                "source": "obs"
            },
            {
                "datetime": "01:00:00",
                "datetimeEpoch": 1716508800,
                "temp": 12.0,
                "feelslike": 12.0,
                "humidity": 66.71,
                "dew": 6.0,
                "precip": 0.0,
                "precipprob": 0.0,
                "snow": 0.0,
                "snowdepth": 0.0,
                "preciptype": null,
                "windgust": 15.8,
                "windspeed": 12.2,
                "winddir": 254.0,
                "pressure": 1016.8,
                "visibility": 10.0,
                "cloudcover": 100.0,
                "solarradiation": 0.0,
                "solarenergy": 0.0,
                "uvindex": 0.0,
                "severerisk": 10.0,
                "conditions": "Overcast",
                "icon": "cloudy",
                "stations": [
                    "EGWU",
                    "EGLL",
                    "D5621",
                    "EGLC"
                ],
                "source": "obs"
            },
        ],
        todayWeatherSummary: 'Partly cloudy throughout the day.'
    };
    const expWeatherData = {
        data: parsedWeatherData,
        message: `Weather on location ${location} retrieved` 
    };

    let redisClientMock;

    beforeEach(() => {
        redisClientMock = redis.createClient();

    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('Test fetch weather data from calling API', async () => {
        axios.get.mockResolvedValueOnce({ data: londonData });

        // Spy on the set method of redisClientMock
        const setSpy = jest.spyOn(redisClientMock, 'set');
        const response = await request(app).get(`/api/weather/${location}`);

        expect(response.body).toEqual(expWeatherData);
        expect(response.status).toBe(200);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(setSpy).toHaveBeenCalledTimes(1);
    });

    test('Test fetch weather API from cached data', async () => {
        // Mock the data retrieval from Redis to return cached data
        redisClientMock.get.mockResolvedValueOnce(JSON.stringify(londonData));

        const response = await request(app).get(`/api/weather/${location}`);

        expect(response.body).toEqual(expWeatherData);
        expect(response.status).toBe(200);
        expect(redisClientMock.get).toHaveBeenCalledTimes(1);
        expect(axios.get).not.toHaveBeenCalled();
    });

    test('Test fetch weather data if location not found', async () => {
        axios.get.mockRejectedValueOnce({ response: { data: 'Invalid location' } });
        const response = await request(app).get(`/api/weather/zz`);
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Inputted location does not exist!');
    });
})