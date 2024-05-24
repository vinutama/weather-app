#  🌥️ Weather Service App

## Description
A simple weather service that provides current weather conditions for a given location.

## Getting Started

### :stars: Stacks
- Node.js
- Express
- Redis
- Docker
- Docker Compose

### ⚙️ Prerequisites
- Visual Crossing Weather API
- Docker
- Docker Compose
- Makefile

### 🛠️ Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/vinutama/weather-app.git
    cd weather-app
    ```

2. Go to https://www.visualcrossing.com and Signup to get your API Key

3. Create a `weather.env` file and add your Visual Crossing Weather API key:
    ```env
    WEATHER_API_KEY={your_api_key}
    WEATHER_API_URL=https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/
    ```
4. Make sure you already installed `make` on your system
    ```bash
    # Linux user
    sudo apt-get update
    sudo apt-get -y install make

    # MacOS user
    brew install make
    ```

5. Make sure your docker installed and running on your system, then simply run this command:
    ```bash
    make fresh-start
    ```

### :books: API Docs

- **Endpoint URL:** `GET /api/weather/:location`
- **Description:** Retrieves current weather for the specified location.
- **Request Parameters:** `/:location`, example: `/jakarta, /surabaya, etc`
- **Status Code:**
  - `200`: Success status code,
  - `400`: If the location is invalid,
  - `500`: Internal server error
- **Response:**
    ```js
    {
      "message": "Success Message",
      "data": {
        "currentWeather": {Object} // all details current weather on specified location,
        "location": {String},
        "timezone": {String},
        "latitude": {Float},
        "longitude": {Float},
        "hourlyWeather": {Array Object} // List of weather conditions hourly.
      }
    }
    ```

### :test_tube: Running Tests
  To run the test just simply run:
  ```bash
    make test-app
  ```

## ⚖️ License
This project is licensed under the MIT License.
