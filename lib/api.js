import axios from 'axios'


export async function fetchAllCountries() {
// REST Countries v3
const res = await axios.get('https://restcountries.com/v3.1/all')
return res.data
}


export async function fetchWeatherByLatLon(lat, lon) {
const key = process.env.NEXT_PUBLIC_OPENWEATHER_KEY
// Use current weather endpoint
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
const r = await axios.get(url)
return r.data
}