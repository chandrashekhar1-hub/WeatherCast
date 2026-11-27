VWeatherCast - Weather Forecasting Website
About the Project
WeatherCast is a simple weather forecasting website made using HTML, CSS and JavaScript. It helps users check the current weather and five-day forecast of a city using the Open-Meteo API.
Features
- Search for cities by name.
- Get automatic city suggestions while typing.
- View temperature, humidity, wind speed and feels-like temperature.
- View weather conditions and icons.
- Check the five-day weather forecast.
- Automatically request updated weather every five minutes.
- Use the website on mobile phones and computers.
Technologies Used
Technology	Purpose
HTML	Creates the structure of the website.
CSS	Designs the website and makes it attractive.
JavaScript	Handles city search and displays weather information.
Open-Meteo API	Provides weather and location data.


Project Structure
WeatherCast/
├── index.html
├── style.css
├── script.js
└── README.md
How to Run
1. Keep the HTML, CSS and JavaScript files in the same folder.
2. Open index.html in a web browser.
3. Make sure you have an internet connection.
4. Type a city name and select a suggestion or click Search.
5. View the current weather and forecast.
No API key, database or backend is required for this educational project.
How It Works
1. The user enters a city name.
2. JavaScript sends a request to the Geocoding API to find matching cities.
3. The user selects a city.
4. The website uses its latitude and longitude to request weather data.
5. JavaScript displays the weather information on the webpage.
Important JavaScript Concepts
- fetch() - Gets data from the API.
- async and await - Help handle API requests.
- setTimeout() - Waits briefly before requesting city suggestions.
- setInterval() - Requests updated weather at regular intervals.
- DOM manipulation - Updates the webpage without reloading it.
Limitations
An internet connection is required. Weather values are based on model data and may differ from other weather websites. Refreshing the website does not guarantee new readings every five minutes.
References
- Open-Meteo Weather API
- Open-Meteo Geocoding API
- MDN Web Docs
Conclusion
This project demonstrates how HTML, CSS, JavaScript and APIs work together to create a useful and interactive frontend website.
