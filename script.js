document.getElementById('weather-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var city = document.getElementById('city-input').value;
    var apiKey = YOUR_API_KEY; // replace with your own API key

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var weatherInfo = document.getElementById('weather-info');
            var predictionInfo = document.getElementById('prediction');

            var pressure = data.main.pressure;
            var temperature = Math.round((data.main.temp - 273.15)* 9/5 + 32);
            var windspeed = Math.round(data.wind.speed * 2.23694);
            var weather_description = data.weather[0].description;
            var is_raining = (weather_description.toLowerCase().includes('rainy') || weather_description.toLowerCase().includes('raining') || weather_description.toLowerCase().includes('rain'))

            var pressure_score = 0;
            var press_desc = "";
            if (pressure <= 1009) {
                pressure_score = 10;
                press_desc = "very low";
            } else if (pressure >= 1023) {
                pressure_score = 0;
                press_desc = "very high";
            } else {
                pressure_score = 10 - (2*(pressure-1009)/(2.8));
                if (pressure_score > 5) {
                    press_desc = "slightly low";
                } else if (pressure_score < 5) {
                    press_desc = "slightly high"
                } else {
                    press_desc = "standard"
                }
            }

            var temperature_score = 0;
            var temp_desc = "";
            if (temperature > 95) {
                temperature_score = 0;
                temp_desc = "remarkably uncomfortable";
            } else if (temperature <= 95 && temperature > 85) {
                temperature_score = 3;
                temp_desc = "very warm";
            } else if (temperature <= 85 && temperature > 75) {
                temperature_score = 7;
                temp_desc = "pretty warm";
            } else if (temperature <= 75 && temperature > 65) {
                temperature_score = 10;
                temp_desc = "just right";
            } else if (temperature <=65 && temperature > 55) {
                temperature_score = 6;
                temp_desc = "slightly chilly";
            } else {
                temperature_score = 2;
                temp_desc = "cold";
            }

            var wind_score = 0;
            var wind_desc = "";
            if (windspeed > 17) {
                wind_score = 2;
                wind_desc = "very difficult";
            } else if (windspeed <= 17 && windspeed > 12) {
                wind_score = 5;
                wind_desc = "harder than usual";
            } else if (windspeed <= 12 && windspeed > 10) {
                wind_score = 10
                wind_desc = "quite manageable, but high enough to get fish active"
            } else if (windspeed <= 10 && windspeed > 5) {
                wind_score = 8
                wind_desc = "feel just right"
            } else {
                wind_score = 5;
                wind_desc = "a piece of cake"
            }
            var rain_score = 0;
            if (is_raining) {
                rain_score = 3;
            }
            var score = Math.round((pressure_score + wind_score + temperature_score + rain_score)/4 * 10)/10;
            var overall_desc = "";
            if (score >= 9) {
                overall_desc = "great";
            } else if (score < 9 && score >=7) {
                overall_desc = "pretty good"
            } else if (score < 7 && score >= 5) {
                overall_desc = "decent"
            } else if (score < 5 && score >= 3) {
                overall_desc = "below average"
            } else {
                overall_desc = "pretty miserable"
            }

            predictionInfo.innerHTML = "Matt's Current Fishing Forecast Score: " + score;
            weatherInfo.innerHTML = 'With a current score of ' + Math.round((pressure_score + wind_score + temperature_score + rain_score)/4 * 10)/10 + ', you can expect a '+ overall_desc
            + ' fishing experience. This score is due to the ' + press_desc + ' barometric pressure, ' + temp_desc + ' temperature, and winds that make casting your rod ' + wind_desc + ". ";
            if (is_raining) {
                weatherInfo.innerHTML = weatherInfo.innerHTML + "Additionally, the current rain may wash bait into the water stimulating fish to feed.";
            }
        })
        .catch(function() {
            var prediction = document.getElementById('prediction');
            prediction.innerHTML = 'There was an error in fetching your report! Make sure you typed the city name in correctly.';
            console.log('An error occurred');
        });
});
