import React, { useState, useEffect, UIEvent } from 'react';
import { WeatherResponse } from "../types/WeatherTypes";
import { apiService_Weather } from "../services/apiService/apiService_Weather";
import { useLocation } from '../contexts/LocationContext';
import { useDate } from '../contexts/DateContext';
import '../styles/WeatherComponent.module.css';



const WeatherComponent: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const { latitude, longitude } = useLocation();
  const { currentDate } = useDate();
 

 

  
  useEffect(() => {
    if (latitude && longitude) {
      apiService_Weather(latitude, longitude)
        .then(setWeatherData)
        .catch(error => console.error("Error fetching weather data:", error));
    }
  }, [latitude, longitude, currentDate]);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  //find the forecast for the selected date
  const forecastToShow = weatherData.daily.find(day =>
    new Date(day.dt * 1000).toDateString() === currentDate.toDateString()
  );

  // if no forecast is found, return a message
  if (!forecastToShow) {
    return <div>No weather data available for the selected date.</div>;
  }

  // find the hourly forecast for the selected date
  const startIndex = weatherData.hourly.findIndex(hour =>
    new Date(hour.dt * 1000).getDate() === currentDate.getDate()
  );
  const endIndex = startIndex + 48;
  const hourlyForecastToShow = weatherData.hourly.slice(startIndex, endIndex);

  const convertToTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
//Todo add a horizontal scroll bar to show the hourly forecast
 const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth / 6;
    const index = Math.round(scrollLeft / itemWidth);
    
  };

  return (
    <div className="weather-container">
      <h2>Weather for {currentDate.toDateString()}</h2>
      <div className="selected-date-weather">
        <img src={`http://openweathermap.org/img/wn/${forecastToShow.weather[0].icon}@2x.png`} alt="Weather icon" />
        <p>Temperature: {forecastToShow.temp.day.toFixed(1)}°C (Min: {forecastToShow.temp.min.toFixed(1)}°C, Max: {forecastToShow.temp.max.toFixed(1)}°C)</p>
        <p>Feels Like: {forecastToShow.feels_like.day}°C</p>
        <p>{forecastToShow.weather[0].description}</p>
        <p>Wind: {forecastToShow.wind_speed} km/h (Gusts up to {forecastToShow.wind_gust} km/h)</p>
        <p>UV Index: {forecastToShow.uvi}</p>
        <p>Sunrise: {convertToTime(forecastToShow.sunrise)}</p>
        <p>Sunset: {convertToTime(forecastToShow.sunset)}</p>
        {forecastToShow.rain && <p>Rain: {forecastToShow.rain}mm</p>}
        {forecastToShow.snow && <p>Snow: {forecastToShow.snow}mm</p>}
        <p>Cloudiness: {forecastToShow.clouds}%</p>
        <p>Precipitation Probability: {forecastToShow.pop * 100}%</p>
        {
          weatherData.alerts && weatherData.alerts.length > 0 ? (
            <div className="weather-alerts">
              {weatherData.alerts.map((alert, index) => (
                <div key={index}>
                  <h3>Alert: {alert.event}</h3>
                  <p>{alert.description}</p>
                  <p>From: {convertToTime(alert.start)} to {convertToTime(alert.end)}</p>
                </div>
              ))}
            </div>
          ) : <p>No weather alerts.</p>
        }
      </div>
      
     
    </div>
  );
};

export default WeatherComponent;