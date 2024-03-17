const APIKey = '02dc0e96d6b1debc7d5ad5928b2d0a6a';
var userInput = document.querySelector('#user-input');
var city = document.querySelector('#city');
var temperature = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var humidity = document.querySelector('#humidity');
var currentDate = dayjs().format(' (d/MM/YYYY)');

function getCityCoords() {
    var cityName = userInput.value.trim();
    if(!cityName)return;
    const coordinatesURL = 'http://api.openweathermap.org/geo/1.0/direct?q='+ cityName +'&appid=' + APIKey + '&units-imperial';
    fetch(coordinatesURL).then(response => response.json()).then(data =>{
        var lat = data[0]['lat'];
        var lon = data[0]['lon'];
        return {lat, lon};
    });
}

function getCityWeather() {
    getCityCoords().then(coords => {
        var lat = coords.lat;
        var lon = coords.lon;

    const weatherURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon=' + lon + '&appid=' + APIKey + '&units-imperial';

    fetch(weatherURL).then(response => response.json()).then(data =>{
        var cityInput = data['name'];
        var cityTemperature = data['main']['temp'];
        var cityWind = data['wind']['speed'] + ' MPH';
        var cityHumidity = data['main']['humidity'];

        city.innerHTML = cityInput + currentDate + weatherIcon;
        temperature.innerHTML = 'Temp: ' + cityTemperature;
        wind.innerHTML = 'Wind: ' + cityWind;
        humidity.innerHTML = 'Humidity: ' +cityHumidity;
        console.log(data)
    })
    .catch(() => {
        alert('an error occured!');
    });
})
}
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', getCityWeather);
searchBtn.addEventListener('click', getCityCoords);