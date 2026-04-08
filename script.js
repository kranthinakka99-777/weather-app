const elements = {
  form: document.getElementById("searchForm"),
  cityInput: document.getElementById("cityInput"),
  locationBtn: document.getElementById("locationBtn"),
  status: document.getElementById("status"),
  currentPanel: document.getElementById("currentPanel"),
  forecastPanel: document.getElementById("forecastPanel"),
  locationName: document.getElementById("locationName"),
  temp: document.getElementById("temp"),
  condition: document.getElementById("condition"),
  feelsLike: document.getElementById("feelsLike"),
  wind: document.getElementById("wind"),
  humidity: document.getElementById("humidity"),
  forecastGrid: document.getElementById("forecastGrid")
};

const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Showers",
  82: "Heavy showers",
  95: "Thunderstorm"
};

function toF(celsius) {
  return (celsius * 9) / 5 + 32;
}

function toMph(kmh) {
  return kmh * 0.621371;
}

function formatTemp(celsius) {
  return `${Math.round(toF(celsius))}°F`;
}

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle("error", isError);
}

function renderCurrentWeather(place, current, daily) {
  elements.locationName.textContent = `${place.name}, ${place.country}`;
  elements.temp.textContent = formatTemp(current.temperature_2m);
  elements.condition.textContent = weatherCodes[current.weather_code] || "Unavailable";
  elements.feelsLike.textContent = formatTemp(current.apparent_temperature);
  elements.wind.textContent = `${Math.round(toMph(current.wind_speed_10m))} mph`;
  elements.humidity.textContent = `${current.relative_humidity_2m}%`;

  renderForecast(daily);

  elements.currentPanel.hidden = false;
  elements.forecastPanel.hidden = false;
}

function renderForecast(daily) {
  const items = daily.time.slice(0, 5).map((day, index) => {
    const date = new Date(day);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const high = formatTemp(daily.temperature_2m_max[index]);
    const low = formatTemp(daily.temperature_2m_min[index]);
    const code = daily.weather_code[index];

    return `
      <article class="forecast-item">
        <p>${dayName}</p>
        <strong>${high} / ${low}</strong>
        <span>${weatherCodes[code] || `Code ${code}`}</span>
      </article>
    `;
  });

  elements.forecastGrid.innerHTML = items.join("");
}

async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: "temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m",
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    timezone: "auto"
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Could not load weather data.");
  }

  return response.json();
}

async function geocodeCity(cityName) {
  const params = new URLSearchParams({ name: cityName, count: 1, language: "en", format: "json" });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Could not find that city.");
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("No matching city found.");
  }

  return data.results[0];
}

async function loadByCoordinates(lat, lon, placeLabel) {
  try {
    setStatus("Loading weather...");
    const weather = await fetchWeather(lat, lon);
    renderCurrentWeather(placeLabel, weather.current, weather.daily);
    setStatus(`Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadByCity(cityName) {
  try {
    setStatus(`Searching for ${cityName}...`);
    const place = await geocodeCity(cityName);
    await loadByCoordinates(place.latitude, place.longitude, place);
  } catch (error) {
    setStatus(error.message, true);
  }
}

function loadByBrowserLocation() {
  if (!navigator.geolocation) {
    setStatus("Geolocation is not available in this browser.", true);
    return;
  }

  setStatus("Getting your location...");
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      const place = { name: "Your location", country: "" };
      await loadByCoordinates(coords.latitude, coords.longitude, place);
    },
    () => {
      setStatus("Could not access your location.", true);
    },
    { timeout: 10000 }
  );
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityName = elements.cityInput.value.trim();

  if (!cityName) {
    setStatus("Please enter a city name.", true);
    return;
  }

  loadByCity(cityName);
});

elements.locationBtn.addEventListener("click", loadByBrowserLocation);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      setStatus("Offline mode unavailable right now.", true);
    });
  });
}

loadByCity("New York");
