// Declaring variables.
const APIKey = '02dc0e96d6b1debc7d5ad5928b2d0a6a';
var userInput = document.querySelector('#user-input');
var city = document.querySelector('#city');
var temperature = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var humidity = document.querySelector('#humidity');
var currentDate = dayjs().format(' (M/D/YYYY)');

function getCityCoords() {
    event.preventDefault();//page kept auto refreshing and could not see console.
    var cityName = userInput.value.trim(); //.trim removes any extra spaces
    if (!cityName) return;
    var coordinatesURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=' + APIKey + '&units-imperial';
    return fetch(coordinatesURL).then(response => response.json()).then(data => {
        var lat = data[0]['lat'];
        var lon = data[0]['lon'];
        return { lat, lon };
    })
    .then(coords => {
        document.querySelector("#user-input").value = "";

        return coords;
    });
}

function getCityWeather() {
    getCityCoords().then(coords => {
        var lat = coords.lat;
        var lon = coords.lon;

        const weatherURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey + '&units=imperial';
        console.log(weatherURL)
        fetch(weatherURL).then(response => response.json()).then(data => {
            var cityInput = data.city.name;
            var cityTemperature = data.list[0].main.temp + '\u00B0F';
            var cityWind = data.list[0].wind.speed + ' MPH';
            var cityHumidity = data.list[0].main.humidity + '%';
            var weatherIcon = data.list[0].weather[0].icon;

            city.innerHTML = cityInput + currentDate +  "<img src = 'https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png'> ";
            temperature.innerHTML = 'Temp: ' + cityTemperature;
            wind.innerHTML = 'Wind: ' + cityWind;
            humidity.innerHTML = 'Humidity: ' + cityHumidity;
            getFiveDayForecast(lat, lon);
            citySearchHistory(data.city.name)
        })
            .catch(() => {
                alert('an error occured!');
            });
    });
}

function getFiveDayForecast(lat, lon) {
    const weatherURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey + '&units=imperial';
    fetch(weatherURL)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.querySelector('.forecast');
            forecastContainer.innerHTML = '';
            for (let i = 0; i < data.list.length; i += 8) { // Data is provided in 3-hour intervals, so we skip 8 entries to get daily data (24 divided by 3 is 8)
                var forecastDate = dayjs(data.list[i].dt_txt).format('M/D/YYYY');
                var forecastTemperature = data.list[i].main.temp + '\u00B0F';
                var forecastWind = data.list[i].wind.speed + ' MPH';
                var forecastHumidity = data.list[i].main.humidity + '%';
                var weatherIcon = data.list[i].weather[0].icon;

                // Create a div and give class card creating bootstrap cards for each of the 5 days.
                var card = document.createElement('div');
                card.classList.add('card', 'bg-dark', 'text-white', 'd-inline-block', 'm-3');
                card.innerHTML = `
                    <h3>${forecastDate}</h3>
                    <img src = "https://openweathermap.org/img/wn/${weatherIcon}@2x.png">
                    <p>Temperature: ${forecastTemperature}</p>
                    <p>Wind: ${forecastWind}</p>
                    <p>Humidity: ${forecastHumidity}</p>
                `;
                document.querySelector('.forecast').appendChild(card); // Appends card to forecast container

            }
        })
        .catch(() => {
            alert('An error occurred while fetching the forecast data!');
        });
        return;
}

function citySearchHistory(cityName){
    // console.log('citySearchHistory', searchHistory.join("").includes(cityName)===false)
    if (!searchHistory.join("").includes(cityName)){
        console.log(searchHistory)
        console.log(cityName)
        searchHistory.push(cityName)
        localStorage.setItem('history', JSON.stringify(searchHistory))
    }
    displaySearchHistory();
}
var searchHistory = JSON.parse(localStorage.getItem('history')) || [];
var searchResults = document.querySelector('.search-results')

function displaySearchHistory() {
    searchResults.innerHTML = '';
    var history = JSON.parse(localStorage.getItem('history'));
    // console.log(history);
    // var buttons = document.createElement('button');
    // buttons.classList.add('cityHistoryBtn', 'btn', 'btn-primary');
    for(let i=0; i < history.length; i++) {
        // console.log(history)
        var button = document.createElement('button');
        button.classList.add('cityHistoryBtn', 'btn', 'btn-primary');
        button.innerHTML = history[i];
        searchResults.append(button);
    }
}

const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', getCityWeather, getCityCoords, getFiveDayForecast, citySearchHistory);

displaySearchHistory();

