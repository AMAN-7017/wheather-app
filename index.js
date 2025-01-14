const apikey = "ffc3d1f7be52848e7b4fe58394a1eea7"
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric"

const input = document.querySelector(".search .search-in");
const btn = document.querySelector(".search .search-btn");
const weatherImg = document.querySelector(".weather-img");
const error = document.querySelector(".error");
const locbtn = document.querySelector('.loc-btn');
const center = document.querySelector('.center');
const micbtn = document.querySelector('.mic-btn');

//------------------------loader-------------------------------------

window.onload = function () {
    const loader = document.querySelector('.loader');
    setTimeout(function () { loader.className += ' hidden' }, 1000)
}


//-------------------Get the weather data by current location of user-------------------------

async function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log(lat, lon)
    center.innerHTML = '<div class="spinner"></div>'
    document.querySelector('.center').style.display = 'block'
    document.querySelector('main .weatherinfo').style.visibility = 'hidden'
    const response = await fetch(apiurl + `&lat=${lat}` + `&lon=${lon}` + `&appid=${apikey}`)
    var data = await response.json();
    console.log(data)
    document.querySelector('main .weatherinfo').style.visibility = 'unset'
    document.querySelector('.center').style.display = 'none'
    if (data.cod != 404) {
        showData(data)
    } else {
        document.querySelector('.error').style.display = 'block'
        document.querySelector('.error').innerHTML = 'City not found!'
    }
}

//-----------------------Get weather data by city name--------------------------

async function fetchData(city) {
    center.innerHTML = '<div class="spinner"></div>'
    document.querySelector('main .weatherinfo').style.visibility = 'hidden'
    document.querySelector('.center').style.display = 'block'
    const response = await fetch(apiurl + `&q=${city}` + `&appid=${apikey}`)
    var data = await response.json();
    document.querySelector('main .weatherinfo').style.visibility = 'unset'
    document.querySelector('.center').style.display = 'none'
    console.log(data)
    if (data.cod != 404) {
        showData(data)
    } else {
        document.querySelector('main .weatherinfo').style.visibility = 'hidden'
        document.querySelector('.error').style.display = 'block'
        document.querySelector('.error').innerHTML = 'City not found!'
    }
}
btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (input.value == '') {
        document.querySelector('.error').style.display = 'block'
        document.querySelector('.error').innerHTML = 'Please, enter city name!'
    }
    else if (!navigator.onLine) {
        document.querySelector('.error').style.display = 'block'
        document.querySelector('.error').innerHTML = 'Your are offline!'
    }
    else {
        fetchData(input.value)
    }
})

locbtn.addEventListener('click', () => {
    if (!navigator.onLine) {
        document.querySelector('.error').style.display = 'block'
        document.querySelector('.error').innerHTML = 'Your are offline!'
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            document.querySelector('.error').style.display = 'block'
            document.querySelector('.error').innerHTML = 'Geolocation is not supported by this browser!'
        }
    }
})

//-----------------------Search by voice-------------------------

// Check if the SpeechRecognition API is available
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // Create an instance of SpeechRecognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    // Configure the recognition settings
    recognition.lang = 'en-US'; // Set the language for speech recognition

    // Add an event listener to the start button
    micbtn.addEventListener('click', () => {
        // Start speech recognition
        recognition.start();
        input.value = ''
        center.innerHTML = '<div class = "mic"><i class="bi bi-mic micicon"></i></div><p class="listen">Listening...</p>'
        document.querySelector('.micicon').style.animation = 'mic .8s infinite'
        document.querySelector('main .weatherinfo').style.visibility = 'hidden'
        document.querySelector('.center').style.display = 'block'
        setTimeout(function () {
            recognition.stop()
            center.innerHTML = '<div class = "mic"><i class="bi bi-mic micicon"></i></div><p class="listen">Didn\'t&nbsp;get&nbsp;that,&nbsp;Try&nbsp;again</p>'
            document.querySelector('main .weatherinfo').style.visibility = 'hidden'
            document.querySelector('.center').style.display = 'block'
        }, 5000)
    })
    // Add an event listener for the 'result' event
    recognition.addEventListener('result', (event) => {
        const transcript = event.results[0][0].transcript; // Get the transcribed speech
        input.value = transcript; // Display the transcribed text
        document.querySelector('main .weatherinfo').style.visibility = 'unset'
        document.querySelector('.center').style.display = 'none'
        if (transcript == '') {
            recognition.stop()
            center.innerHTML = '<div class = "mic"><i class="bi bi-mic micicon"></i></div><p class="listen">Didn\'t&nbsp;get&nbsp;that,&nbsp;Try&nbsp;again</p>'
            document.querySelector('main .weatherinfo').style.visibility = 'hidden'
            document.querySelector('.center').style.display = 'block'
        } else {
            fetchData(transcript)
            recognition.stop()
        }


    });

    // Add an event listener for the 'end' event
    // recognition.addEventListener('end', () => {
    // center.innerHTML = '<div class = "mic"><i class="bi bi-mic micicon"></i></div><p class="listen">Didn\'t&nbsp;get&nbsp;that,&nbsp;Try&nbsp;again</p>'
    // document.querySelector('main .weatherinfo').style.visibility = 'hidden'
    // document.querySelector('.center').style.display = 'block'
    // });
} else {
    console.error('Speech recognition is not supported in this browser.');
}


//-------------------------Show data on display--------------------------

function showData(data) {
    document.querySelector('.error').style.display = 'none'

    document.querySelector('.city').innerHTML = '<i class="bi bi-geo-alt-fill"></i>' + data.name + ', ' + data.sys.country;
    document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°c';
    document.querySelector('.humidity').innerHTML = data.main.humidity + ' %';
    document.querySelector('.wind_speed').innerHTML = Math.round((data.wind.speed / 1000) * 60 * 60) + ' km/h';
    document.querySelector('.status').innerHTML = data.weather[0].main;
    document.querySelector('.desc').innerHTML = data.weather[0].description;
    document.querySelector('.feels_like').innerHTML = Math.round(data.main.feels_like) + '°c';
    document.querySelector('.max_temp').innerHTML = Math.round(data.main.temp_max) + '°c';
    document.querySelector('.min_temp').innerHTML = Math.round(data.main.temp_min) + '°c';
    document.querySelector('.visibility').innerHTML = (data.visibility) / 1000 + 'km';
    document.querySelector('.pressure').innerHTML = data.main.pressure + ' hPa';
    document.querySelector('.clouds').innerHTML = data.clouds.all + '%';
    document.querySelector('.day').innerHTML = day(data.dt);
    document.querySelector('.time').innerHTML = time(data.timezone);
    document.querySelector('.sunrise').innerHTML = suntime(data.timezone, data.sys.sunrise);
    document.querySelector('.sunset').innerHTML = suntime(data.timezone, data.sys.sunset);

    const sunrise = suntime(data.timezone, data.sys.sunrise).split(':')[0];
    const sunset = suntime(data.timezone, data.sys.sunset).split(':')[0];
    var hour = time(data.timezone).split(':')[0];

    function setColor(color){
        document.querySelector('.body').style.color = color
        document.querySelector('a').style.color = color
    }

    if (data.weather[0].main == "Clear") {

        if (hour > sunrise && hour < sunset) {
            document.querySelector('.weather-img').src = 'images/sun.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/sun.jpg)'
            setColor('white')
        } else if (hour == sunrise) {
            document.querySelector('.weather-img').src = 'images/sunrise.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/sunrise.jpg)'
            setColor('white')
        } else if (hour == sunset) {
            document.querySelector('.weather-img').src = 'images/sunset.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/sunset.jpg)'
            setColor('white')
        } else {
            document.querySelector('.weather-img').src = 'images/moon.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/moon.jpg)'
            setColor('white')
        }
    }
    if (data.weather[0].main == "Clouds") {
        if (hour > sunrise && hour < sunset) {
            if (data.weather[0].description == "overcast clouds") {
                document.querySelector('.weather-img').src = 'images/sun-more-clouds.png'
                document.querySelector('.body').style.backgroundImage = 'url(images/more-clouds.jpg)'
                setColor('black')
            } else {
                document.querySelector('.weather-img').src = 'images/sun-less-clouds.png'
                document.querySelector('.body').style.backgroundImage = 'url(images/few-clouds.jpg)'
                setColor('white')
            }
        }  else if (hour == sunrise) {
            document.querySelector('.weather-img').src = 'images/sunrise.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/sunrise.jpg)'
            setColor('white')
        } else if (hour == sunset) {
            document.querySelector('.weather-img').src = 'images/sunset.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/sunset.jpg)'
            setColor('white')
        }else {
            document.querySelector('.weather-img').src = 'images/moon-clouds.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/moon-clouds.jpg)'
            setColor('white')
        }

    }
    if (data.weather[0].main == "Rain") {
        document.querySelector('.weather-img').src = 'images/heavy-rain.png'
        document.querySelector('.body').style.backgroundImage = 'url(images/rain.jpeg)'
        setColor('white')

    }
    if (data.weather[0].main == "Mist") {
        if (hour > sunrise && hour < sunset) {
            document.querySelector('.weather-img').src = 'images/sun-mist.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/mist.jpg)'
            setColor('white')
        } else {
            document.querySelector('.weather-img').src = 'images/moon-mist.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/mist-night.jpg)'
            setColor('white')
        }

    }
    if (data.weather[0].main == "Drizzle") {
        if (hour > sunrise && hour < sunset) {
            document.querySelector('.weather-img').src = 'images/sun-drizzle.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/drizzle.jpg)'
            setColor('white')
        } else {
            document.querySelector('.weather-img').src = 'images/moon-drizzle.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/drizzle.jpg)'
            setColor('white')
        }

    }
    if (data.weather[0].main == "Snow") {
        if (hour > sunrise && hour < sunset) {
            document.querySelector('.weather-img').src = 'images/sun-snow.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/snow.jpg)'
            setColor('white')
        } else {
            document.querySelector('.weather-img').src = 'images/moon-snow.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/snow-night.jpg)'
            setColor('white')
        }

    }
    if (data.weather[0].main == "Thunderstorm") {
        if (hour > sunrise && hour < sunset) {
            document.querySelector('.weather-img').src = 'images/sun-thunder.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/thunder.jpg)'
            setColor('white')
        } else {
            document.querySelector('.weather-img').src = 'images/moon-thunder.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/thunder.jpg)'
            setColor('white')
        }


    }
    if (data.weather[0].main == "Haze") {
        if (hour > sunrise && hour < sunset) {
            document.querySelector('.weather-img').src = 'images/sun-haze.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/haze.jpg)'
            setColor('black')
        } else {
            document.querySelector('.weather-img').src = 'images/moon-haze.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/haze-night.jpg)'
            setColor('white')
        }

    }
    if (data.weather[0].main == "Smoke") {
        if (hour > sunrise && hour < sunset) {
            document.querySelector('.weather-img').src = 'images/smock.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/smock.jpg)'
            setColor('white')
        } else {
            document.querySelector('.weather-img').src = 'images/smock.png'
            document.querySelector('.body').style.backgroundImage = 'url(images/smock-night.jpg)'
            setColor('white')
        }

    }
    if (data.weather[0].main == "Dust") {
        document.querySelector('.weather-img').src = 'images/mist.png'
        document.querySelector('.body').style.backgroundImage = 'url(images/dust.jpg)'
        setColor('white')
    }


}

//---------------------Get the date---------------------------

function date(ts) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    var d = new Date(ts * 1000);
    var date = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    return months[month] + " " + date + " " + year;

}

//------------------------Get the day----------------------------

function day(ts) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(ts * 1000);
    var day = d.getDay();
    return days[day];
}

//--------------------------Get the time of the city-----------------------------

function time(tz) {
    var d = new Date()
    var localTime = d.getTime()
    var localOffset = d.getTimezoneOffset() * 60000
    var utc = localTime + localOffset
    var city = utc + (1000 * tz)
    var time = new Date(city)
    var hour = time.getHours()
    var min = time.getMinutes()
    var ampm = hour > 12 ? "PM" : "AM"
    if (min < 10) {
        min = "0" + min
    }
    if (hour < 10) {
        hour = "0" + hour
    }
    return hour + ':' + min + ' ' + ampm
}

//-------------------Get the sunrise and sunset time--------------------------

function suntime(tz, sun) {
    var d = new Date(sun * 1000)
    var localTime = d.getTime()
    var localOffset = d.getTimezoneOffset() * 60000
    var utc = localTime + localOffset
    var city = utc + (1000 * tz)
    var time = new Date(city)
    var hour = time.getHours()
    var min = time.getMinutes()
    var ampm = hour > 12 ? "PM" : "AM"
    if (min < 10) {
        min = "0" + min
    }
    if (hour < 10) {
        hour = "0" + hour
    }
    return hour + ':' + min + ' ' + ampm
}