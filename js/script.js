const APIKey ='0346cd5d826d768ec6a59b121a55e2fa';
let city;
const queryURL ='https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}';

var currentDateTime = dayjs().format('d MM YYYY hh:mm:ss')

fetch(queryURL)