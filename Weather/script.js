let selectedCity = null;
let typingTimer;
let searchId = 0;
let weatherId = 0;

const cityInput = document.getElementById("city");
const suggestions = document.getElementById("suggestions");
const weather = document.getElementById("weather");
const forecast = document.getElementById("forecast");
const statusText = document.getElementById("status");

async function findCities(city) {
    let url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=6&language=en&format=json`;

    let response = await fetch(url);

    if (!response.ok)
        throw new Error("Search failed");

    let data = await response.json();

    return data.results || [];
}

function suggestCities() {
    clearTimeout(typingTimer);

    let city = cityInput.value.trim();
    let id = ++searchId;

    suggestions.innerHTML = "";

    if (city.length < 2)
        return;

    typingTimer = setTimeout(async function() {
        try {
            let places = await findCities(city);

            if (id != searchId)
                return;

            suggestions.innerHTML = "";

            places.forEach(function(place) {
                let div = document.createElement("div");

                div.className = "suggestion";

                div.textContent = "📍 " +
                    [place.name, place.admin1, place.country]
                    .filter(Boolean).join(", ");

                div.onclick = function() {
                    selectCity(place);
                };

                suggestions.appendChild(div);
            });

        } catch (error) {
            if (id == searchId)
                suggestions.textContent = "Unable to load suggestions";
        }
    }, 300);
}

function selectCity(place) {
    searchId++;
    clearTimeout(typingTimer);

    selectedCity = place;

    cityInput.value = place.name;
    suggestions.innerHTML = "";

    getWeather(place);
}

async function searchWeather() {
    let city = cityInput.value.trim();

    if (city == "") {
        alert("Please enter city name");
        return;
    }

    let id = ++searchId;
    clearTimeout(typingTimer);
    suggestions.innerHTML = "";

    try {
        let places = await findCities(city);

        if (id != searchId)
            return;

        if (places.length == 0) {
            statusText.textContent = "City not found";
            return;
        }

        selectCity(places[0]);

    } catch (error) {
        statusText.textContent = "Unable to search city";
    }
}

function weatherCondition(code) {
    if (code == 0)
        return ["☀️", "Clear Sky"];

    if (code <= 2)
        return ["🌤️", "Partly Cloudy"];

    if (code == 3)
        return ["☁️", "Cloudy"];

    if (code <= 48)
        return ["🌫️", "Foggy"];

    if (code <= 57)
        return ["🌦️", "Drizzle"];

    if (code <= 67)
        return ["🌧️", "Rainy"];

    if (code <= 77)
        return ["❄️", "Snow"];

    if (code <= 82)
        return ["🌧️", "Rain Showers"];

    if (code <= 86)
        return ["❄️", "Snow Showers"];

    return ["⛈️", "Thunderstorm"];
}

async function getWeather(place) {
    let id = ++weatherId;
    statusText.textContent = "Fetching weather...";

    try {
        let url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`;

        let response = await fetch(url);

        if (!response.ok)
            throw new Error("Weather request failed");

        let data = await response.json();

        if (id != weatherId)
            return;

        let current = data.current;
        let condition = weatherCondition(current.weather_code);

        if (current.is_day == 0 && current.weather_code == 0)
            condition = ["🌙", "Clear Night"];

        weather.innerHTML = `
            <h2 id="location"></h2>

            <div class="weather-icon">
                ${condition[0]}
            </div>

            <h1 class="temperature">
                ${current.temperature_2m}°C
            </h1>

            <p class="condition">
                ${condition[1]}
            </p>

            <div class="details">

                <div class="info">
                    <h3>💧 Humidity</h3>
                    <h2>${current.relative_humidity_2m}%</h2>
                </div>

                <div class="info">
                    <h3>💨 Wind Speed</h3>
                    <h2>${current.wind_speed_10m}</h2>
                    <p>km/h</p>
                </div>

                <div class="info">
                    <h3>🌡️ Feels Like</h3>
                    <h2>${current.apparent_temperature}°C</h2>
                </div>

            </div>
        `;

        document.getElementById("location").textContent =
            [place.name, place.admin1, place.country]
            .filter(Boolean).join(", ");

        forecast.innerHTML = "";

        for (let i = 0; i < 5; i++) {

            let dayCondition =
                weatherCondition(data.daily.weather_code[i]);

            let date = new Date(data.daily.time[i] + "T12:00:00");

            let day = date.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short"
            });

            forecast.innerHTML += `
                <div class="day">

                    <b>${day}</b>

                    <div class="day-icon">
                        ${dayCondition[0]}
                    </div>

                    <p>${dayCondition[1]}</p>

                    <p>Max: ${data.daily.temperature_2m_max[i]}°C</p>

                    <p>Min: ${data.daily.temperature_2m_min[i]}°C</p>

                </div>
            `;
        }

        statusText.textContent =
            "Weather data: " + current.time.replace("T", " ") +
            " | Local time of selected city";

    } catch (error) {
        if (id == weatherId)
            statusText.textContent = "Unable to update weather data";
    }
}

cityInput.addEventListener("keydown", function(event) {
    if (event.key == "Enter")
        searchWeather();
});

document.addEventListener("click", function(event) {
    if (!event.target.closest(".search-box")) {
        searchId++;
        suggestions.innerHTML = "";
    }
});

setInterval(function() {
    if (selectedCity != null)
        getWeather(selectedCity);
}, 300000);

cityInput.value = "Jabalpur";
searchWeather();