const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "d8e17c4bf2e9c6c4a1e4dfaf970742b6";

// Function to create weather card HTML
const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    // HTML for the main weather card
    return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(
                      2
                    )}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${
                      weatherItem.weather[0].icon
                    }.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
  } else {
    // HTML for the other five day forecast card
    return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${
                      weatherItem.weather[0].icon
                    }.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(
                      2
                    )}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
  }
};

// Function to fetch weather details
const getWeatherDetails = (cityName, latitude, longitude) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((response) => response.json())
    .then((data) => {
      // Filter the forecasts to get only one forecast per day
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      // Clearing previous weather data
      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      weatherCardsDiv.innerHTML = "";

      // Creating weather cards and adding them to the DOM
      fiveDaysForecast.forEach((weatherItem, index) => {
        const html = createWeatherCard(cityName, weatherItem, index);
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML("beforeend", html);
        } else {
          weatherCardsDiv.insertAdjacentHTML("beforeend", html);
        }
      });
    })
    .catch(() => {
      Swal.fire("Fetching....");
    });
};

// Function to fetch coordinates based on city name
const getCityCoordinates = () => {
  const cityName = "London";
  const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  // Get coordinates based on the default city name
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon); // Get weather details based on coordinates
    })
    .catch(() => {
      Swal.fire("Fetching.... PLeasee hold on!");
    });
};

// Load weather details for default city on screen load
window.onload = () => {
  getCityCoordinates();
};

// Function to fetch user coordinates
const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords; // Get user coordinates
      const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude); // Get weather details based on user coordinates
        })
        .catch(() => {
          Swal.fire("An error occurred while fetching the city name!");
        });
    },
    (error) => {
      // Show alert if user denied the location permission
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation request denied. Please reset location permission to grant access again."
        );
      } else {
        alert("Geolocation request error. Please reset location permission.");
      }
    }
  );
};

// Event listener for location button click
//locationButton.addEventListener("click", getUserCoordinates);

// Event listener for search button click
//searchButton.addEventListener("click", getCityCoordinates);

/* Event listener for Enter key press on city input field
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);
*/

/* ================ Code for the Home Weather ====================*/

const city = "Mutare";

// Function to fetch weather data from OpenWeatherMap API
function fetchWeatherData() {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data.list[0]);
      displayForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

// Function to display current weather
function displayCurrentWeather(weatherData) {
  const temp = document.querySelector(".temp");
  const icon = document.querySelector(".temp-icon");
  const humidity = document.querySelector(".humidity");
  const wind = document.querySelector(".wind");
  const rainProbability = document.querySelector(".rain-probability");

  temp.textContent = `${Math.round(weatherData.main.temp)}°C`;
  icon.innerHTML = `<i class="bi bi-${getWeatherIcon(
    weatherData.weather[0].id
  )}"></i>`;
  humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
  wind.textContent = `Wind Speed: ${weatherData.wind.speed} m/s`;
  rainProbability.textContent = `Rain Probability: ${weatherData.pop * 100}%`;
}

// Function to display forecast
function displayForecast(weatherData) {
  const forecastDays = document.querySelectorAll(".day");

  for (let i = 0; i < forecastDays.length; i++) {
    const dayData = weatherData[i * 8 + 4]; // Get data for every 12 hours (8 * 3-hour intervals)
    const dayName = forecastDays[i].querySelector(".day-name");
    const dayTemp = forecastDays[i].querySelector(".day-temp");
    const dayIcon = forecastDays[i].querySelector(".day-icon");

    dayName.textContent = new Date(dayData.dt * 1000)
      .toLocaleString("en-us", { weekday: "short" })
      .toUpperCase();
    dayTemp.textContent = `${Math.round(dayData.main.temp)}°C`;
    dayIcon.innerHTML = `<i class="bi bi-${getWeatherIcon(
      dayData.weather[0].id
    )}"></i>`;
  }
}

// Function to get weather icon based on weather condition code
function getWeatherIcon(weatherCode) {
  const icons = {
    "01d": "sun", // Clear sky (day)
    "01n": "moon", // Clear sky (night)
    "02d": "cloudy-sunrain", // Few clouds (day)
    "02n": "cloudy", // Few clouds (night)
    "03d": "cloud", // Scattered clouds (day)
    "03n": "cloud", // Scattered clouds (night)
    "04d": "clouds", // Broken clouds (day)
    "04n": "clouds", // Broken clouds (night)
    "09d": "cloud-drizzle", // Shower rain (day)
    "09n": "cloud-drizzle", // Shower rain (night)
    "10d": "cloud-rain", // Rain (day)
    "10n": "cloud-rain", // Rain (night)
    "11d": "cloud-lightning-rain", // Thunderstorm (day)
    "11n": "cloud-lightning-rain", // Thunderstorm (night)
    "13d": "snow", // Snow (day)
    "13n": "snow", // Snow (night)
    "50d": "cloud-fog", // Mist (day)
    "50n": "cloud-fog", // Mist (night)
  };

  return (
    icons[`${weatherCode.toString().slice(0, 2)}${timeOfDay()}`] || "question"
  );
}

// Helper function to determine day or night
function timeOfDay() {
  const currentHour = new Date().getHours();
  return currentHour >= 6 && currentHour < 18 ? "d" : "n";
}

// Fetch weather data on page load
fetchWeatherData();
