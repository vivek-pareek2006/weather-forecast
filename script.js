const suggestion = document.getElementById("suggestions");
const cityInput = document.getElementById("city");
const apiKey = "{API-KEY_HERE}";

cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();

  if (query.length < 2) {
    suggestion.innerHTML = "";
    return;
  }

  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    suggestion.innerHTML = ""; // Clear previous suggestions

    data.forEach(city => {
      const div = document.createElement("div");
      div.textContent = `${city.name}${city.state ? ", " + city.state : ""}, ${city.country}`;

      div.addEventListener("click", () => {
        cityInput.value = `${city.name},${city.country}`;
        suggestion.innerHTML = "";
      });

      suggestion.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching suggestions:", err);
  }
});

// Close suggestion box on outside click
document.addEventListener("click", function (e) {
  if (!cityInput.contains(e.target) && !suggestion.contains(e.target)) {
    suggestion.innerHTML = "";
  }
});

async function getWeather() {
  const city = document.getElementById("city").value;

  const Url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  try {
    const response = await fetch(Url);
    const data = await response.json();

    if (data.length === 0) {
      document.getElementById("output").innerText = "City not found.";
      return;
    }

    const lat = data[0].lat;
    const lon = data[0].lon;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (weatherData.main) {
      const temp = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const wind = weatherData.wind.speed;
      const desc = weatherData.weather[0].description;

      document.getElementById("output").innerText =
        `Temp: ${temp}°C\n` +
        `Humidity: ${humidity}%\n` +
        `Wind Speed: ${wind} m/s\n` +
        `Description: ${desc}`;
    } else {
      document.getElementById("output").innerText = "Weather data not available.";
    }
  } catch (error) {
    document.getElementById("output").innerText = "Error fetching weather data.";
    console.error(error);
  }
}
