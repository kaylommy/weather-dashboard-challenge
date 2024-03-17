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
    if(!cityName)return;
    var coordinatesURL = 'http://api.openweathermap.org/geo/1.0/direct?q='+ cityName +'&appid=' + APIKey + '&units-imperial';
    return fetch(coordinatesURL).then(response => response.json()).then(data =>{
        var lat = data[0]['lat'];
        var lon = data[0]['lon'];
        return {lat, lon};
    });
}

function getCityWeather() {
    getCityCoords().then(coords => {
        var lat = coords.lat;
        var lon = coords.lon;

    const weatherURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon=' + lon + '&appid=' + APIKey + '&units=imperial';
console.log(weatherURL)
    fetch(weatherURL).then(response => response.json()).then(data =>{
        var cityInput = data.city.name;
        var cityTemperature = data.list[0].main.temp + '\u00B0F';
        var cityWind = data.list[0].wind.speed + ' MPH';
        var cityHumidity = data.list[0].main.humidity + '%';

        city.innerHTML = cityInput + currentDate;
        temperature.innerHTML = 'Temp: ' + cityTemperature;
        wind.innerHTML = 'Wind: ' + cityWind;
        humidity.innerHTML = 'Humidity: ' + cityHumidity;
        getFiveDayForecast(lat, lon);
        
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
            for (let i = 0; i < data.list.length; i += 8) { // Data is provided in 3-hour intervals, so we skip 8 entries to get daily data
                var forecastDate = dayjs(data.list[i].dt_txt).format('M/D/YYYY');
                var forecastTemperature = data.list[i].main.temp + '\u00B0F';
                var forecastWind = data.list[i].wind.speed + ' MPH';
                var forecastHumidity = data.list[i].main.humidity + '%';

                // Create a div and give class card creating bootstrap cards for each of the 5 days.
                var card = document.createElement('div');
                card.classList.add('card', 'bg-dark', 'text-white', 'd-inline-block', 'm-3');
                card.style.height = '200px';
                // card.classList.add('bg-dark');
                card.innerHTML = `
                    <h3>${forecastDate}</h3>
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
}
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', getCityWeather, getCityCoords, getFiveDayForecast);

