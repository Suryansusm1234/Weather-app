"use client"
import React, { useState,  JSX } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Search,
 
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  Cloud,
  AlertTriangle,
  Shirt,
} from 'lucide-react';

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: string;
  description: string;
  city: string;
  country: string;
  precipitation: number;
}

interface ForecastItem {
  time: string;
  temp: number;
  icon: JSX.Element;
  precipitation: string;
}

export default function WeatherWise() {
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [outfitSuggestion, setOutfitSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const NEXT_PUBLIC_OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const GEMINI_API_KEY = `${process.env.NEXT_PUBLIC_GEMINI_API_KEY }`;

  const fetchCoordinates = async (cityName: string) => {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${NEXT_PUBLIC_OPENWEATHER_API_KEY}`
    );
    const data = await res.json();
    if (data.length === 0) throw new Error('City not found');
    return { lat: data[0].lat, lon: data[0].lon };
  };

  const fetchWeather = async (lat: number, lon: number) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${NEXT_PUBLIC_OPENWEATHER_API_KEY}`
    );
    const data = await res.json();
    if (data.cod !== 200) throw new Error(data.message);
    return data;
  };

  const fetchForecast = async (lat: number, lon: number) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${NEXT_PUBLIC_OPENWEATHER_API_KEY}`
    );
    const data = await res.json();
    if (data.cod !== '200') throw new Error(data.message);
    return data.list.slice(0, 7);
  };

  const getAISuggestions = async (weather: WeatherData) => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `As a fashion expert, suggest appropriate clothing for:
      - Current temperature: ${weather.temp}°C (feels like ${weather.feelsLike}°C)
      - Weather condition: ${weather.description}
      - Humidity: ${weather.humidity}%
      - Wind speed: ${weather.windSpeed} km/h
      - Precipitation: ${weather.precipitation} mm
  
      Provide:
      1. 3-4 outfit suggestions as bullet points along with the colour for man and woman
      2. Recommended accessories
      3. Special considerations
      Use simple, clear language without markdown formatting.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Clean up the response text
      const text = response.text()
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/\*/g, '•')  // Convert asterisks to bullet points
        .trim();
  
      return text;
    } catch (err) {
      return 'Could not generate outfit suggestions.';
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const { lat, lon } = await fetchCoordinates(city);
      const weather = await fetchWeather(lat, lon);
      const forecast = await fetchForecast(lat, lon);

      const data: WeatherData = {
        temp: Math.round(weather.main.temp - 273.15),
        feelsLike: Math.round(weather.main.feels_like - 273.15),
        humidity: weather.main.humidity,
        windSpeed: (weather.wind.speed * 3.6).toFixed(1),
        description: weather.weather[0].description,
        city: weather.name,
        country: weather.sys.country,
        precipitation: weather.rain ? weather.rain['1h'] || 0 : 0,
      };

      const forecastData: ForecastItem[] = forecast.map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(item.main.temp - 273.15),
        icon: item.weather[0].main === 'Clear' ? <Sun size={20} className="text-yellow-400" /> : <Cloud size={20} className="text-gray-300" />,
        precipitation: item.pop ? `${Math.round(item.pop * 100)}%` : '0%'
      }));

      const suggestions = await getAISuggestions(data);

      setWeatherData(data);
      setForecastData(forecastData);
      setOutfitSuggestion(suggestions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const convertTemp = (temp: number) => temperatureUnit === 'F' ? Math.round((temp * 9/5) + 32) : temp;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white px-4 py-6 sm:px-8 md:px-16">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Sun className="text-yellow-400" size={28} />
          <h1 className="text-2xl font-bold">WeatherWise</h1>
        </div>
        <button
          className="bg-white/10 hover:bg-white/20 rounded-full px-4 py-1 text-sm"
          onClick={() => setTemperatureUnit(prev => prev === 'C' ? 'F' : 'C')}
        >
          °{temperatureUnit}
        </button>
      </header>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute top-3 left-3 text-gray-400" size={18} />
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Search city..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>

      {loading && <p className="text-center text-blue-300">Loading...</p>}
      {error && <p className="text-center text-red-400 flex justify-center items-center gap-2"><AlertTriangle size={16} />{error}</p>}

      {weatherData && (
        <div className="space-y-8">
          <div className="bg-blue-600 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <h2 className="text-2xl font-bold">{weatherData.city}, {weatherData.country}</h2>
                <p className="capitalize text-lg">{weatherData.description}</p>
                <div className="flex items-end mt-2">
                  <span className="text-5xl font-bold">{convertTemp(weatherData.temp)}</span>
                  <span className="text-xl">°{temperatureUnit}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <Thermometer size={18} />
                  <span>{convertTemp(weatherData.feelsLike)}° feels like</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets size={18} />
                  <span>{weatherData.humidity}% humidity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind size={18} />
                  <span>{weatherData.windSpeed} km/h wind</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CloudRain size={18} />
                  <span>{weatherData.precipitation} mm rain</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 overflow-x-auto whitespace-nowrap">
            <h3 className="mb-4 font-semibold">Upcoming Forecast</h3>
            <div className="flex gap-6">
              {forecastData.map((item, i) => (
                <div key={i} className="bg-blue-400/10 px-4 py-2 rounded-lg text-center">
                  <p className="text-sm font-semibold mb-1">{item.time}</p>
                  {item.icon}
                  <p className="text-lg">{convertTemp(item.temp)}°</p>
                  <p className="text-xs text-gray-300">{item.precipitation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shirt size={20} className="text-green-400" />
              <h3 className="font-semibold text-lg">AI Outfit Suggestions</h3>
            </div>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{outfitSuggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
