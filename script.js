const form = document.getElementById('form');
let name1 = document.getElementById('location');
const toggleTemp = document.getElementById('checkbox');
let scaleLabel = document.getElementById('scale-label');
const baseURL = 'https://api.weatherapi.com/v1/current.json?key=a9bbb937b40543539ef211400242802&q=';

let currentLocationData;
let scaleOfTemp;
const errorTxt = document.getElementById('error-message');
let dataDisplay = document.getElementById('display-data');


if (localStorage.getItem('current-scale') === null) {
  localStorage.setItem('current-scale', 'farenheight');
}

// On load of page, set the toggle button and label to the scale
// that is in localstorage.
(function checkCurrentScale() {
  let currentScale = localStorage.getItem('current-scale');
  if (currentScale === 'celsius') {
    toggleTemp.checked = true;
    scaleLabel.innerHTML = 'celsius';
    scaleOfTemp = 'celsius';
  } else {
    toggleTemp.checked = false;
    scaleLabel.innerHTML = 'farenheight';
    scaleOfTemp = 'farenheight';
  }
})();

toggleTemp.addEventListener('change', validateChecked )

function validateChecked() {
  if (toggleTemp.checked) {
    scaleOfTemp = 'celsius';
    localStorage.setItem('current-scale', `${scaleOfTemp}`);
    scaleLabel.innerHTML = 'celsius';
    if (currentLocationData) {
      processWeatherData();
    }
  } else {
    scaleOfTemp = 'farenheight';
    localStorage.setItem('current-scale', `${scaleOfTemp}`);
    scaleLabel.innerHTML = 'farenheight';
    if (currentLocationData) {
      processWeatherData();
    }
  }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWeather();
    processWeatherData();
})

async function getWeather() {   
  // await response from fetch request
  try {
    let response = await fetch(baseURL + name1.value);
    // request is resolved but if it's a BAD request...
    if (!response.ok) {
      // get request text and assign it to variable
      let text = await response.text();
      let errorMsg = JSON.parse(text).error.message;
      errorTxt.innerHTML = '';
      errorTxt.innerHTML = `${errorMsg}`;
      console.log(errorMsg);
      // throw an error with that text and go to catch block for handling said error...
      throw Error(errorMsg);
    }

    let data = await response.json();
    console.log(data.location.name);
    return data;
    
  } catch (error) {
    console.log(error);
    dataDisplay.replaceChildren();
    dataDisplay.innerHTML = `${error}`;
  }
}

async function processWeatherData() {
    getWeather().then(data => {
      currentLocationData = {
        location: `${data.location.name}`,
        condition: `${data.current.condition.text}`,
        tempC: `${data.current.temp_c}`,
        tempF: `${data.current.temp_f}`,
        uv: `${data.current.uv}`,
        humidity: `${data.current.humidity + '%'}`,
      }
      return currentLocationData;
      })
      .then(currentData => {
        renderData(currentData)
      })

}

async function renderData(data) {
  toggleTemp.disabled = false;
  toggleTemp.hidden = false;
  scaleLabel.hidden = false;

  dataDisplay.replaceChildren();

  let cityName = (data.location);
  let tempC = (data.tempC);
  let tempF = (data.tempF);
  let condition = (data.condition);
  let uv = (data.uv);
  let humidity = (data.humidity);

  let cityEl = document.createElement('p');
  let tempDisplay = document.createElement('h1');
  let conditionEl = document.createElement('p');
  let uvEl = document.createElement('p');
  let humidityEl = document.createElement('p');

  if (scaleOfTemp == 'celsius') {
    tempDisplay.append(tempC + `\u00B0`);
  } else {
    tempDisplay.append(tempF + `\u00B0`);
  }
  
  cityEl.append(cityName);
  conditionEl.append(condition);
  uvEl.append(`UV Index: ${uv}`);
  humidityEl.append(`Humidity: ${humidity}`);

  dataDisplay.append(cityEl);
  dataDisplay.append(tempDisplay);
  dataDisplay.append(conditionEl);
  dataDisplay.append(uvEl);
  dataDisplay.append(humidityEl); 

  if ((tempC < 15.5) || (tempF < 60)) {
    document.body.style.backgroundColor = 'lightblue';
  } else if ((tempC > 26) || (tempF >= 80)) {
    document.body.style.backgroundColor = 'red';
  } else {
    document.body.style.backgroundColor = 'lightgreen';
  }

}