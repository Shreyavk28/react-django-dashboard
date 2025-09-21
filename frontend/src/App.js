// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css';
import BarChart from './BarChart'; // Import the new component
import StatCard from './StatCard'; // NEW: Import StatCard
import PieChart from './PieChart'; // NEW: Import the PieChart component

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// NEW: A helper function to translate weather codes into text
const getWeatherDescription = (code) => {
    const descriptions = {
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing Rime Fog',
        51: 'Light Drizzle', 53: 'Drizzle', 55: 'Dense Drizzle',
        61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
        80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
        95: 'Thunderstorm'
    };
    return descriptions[code] || 'Unknown';
};

function App() {
  // NEW: State for both charts
  const [tempData, setTempData] = useState(null);
  const [humidityData, setHumidityData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null); // NEW: State for current weather


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/weather-data/');
        const data = res.data;
        setCurrentWeather(data.current_weather); // NEW: Set current weather state
        const labels = data.hourly.time.map(t => new Date(t).toLocaleTimeString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit' }));

        // NEW: Format data for Temperature Chart
        const formattedTempData = {
          labels: labels,
          datasets: [
            {
              label: 'Temperature (°C)',
              data: data.hourly.temperature_2m,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        };

        // NEW: Format data for Humidity Chart
        const formattedHumidityData = {
          labels: labels,
          datasets: [
            {
              label: 'Humidity (%)',
              data: data.hourly.relativehumidity_2m,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
          ],
        };

        setTempData(formattedTempData);
        setHumidityData(formattedHumidityData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

   return (
    <div className="App">
      <header className="App-header">
        <h1>Bengaluru Weather Forecast</h1>

        {/* ROW 1: Stat Cards */}
        <div className="stats-container">
          {currentWeather ? (
            <>
              <StatCard title="Current Temperature" value={currentWeather.temperature} unit="°C" />
              <StatCard title="Wind Speed" value={currentWeather.windspeed} unit="km/h" />
              <StatCard title="Weather" value={getWeatherDescription(currentWeather.weathercode)} unit="" />
            </>
          ) : (
            <p>Loading current conditions...</p>
          )}
        </div>

        {/* ROW 2: Line Charts */}
        <div className="charts-container">
          <div className="chart-wrapper">
            {tempData ? <Line data={tempData} /> : <p>Loading Temperature Chart...</p>}
          </div>
          <div className="chart-wrapper">
            {humidityData ? <Line data={humidityData} /> : <p>Loading Humidity Chart...</p>}
          </div>
        </div>

        {/* ROW 3: Bar and Pie Charts */}
        <div className="charts-container">
          <div className="chart-wrapper">
            <BarChart />
          </div>
          <div className="chart-wrapper">
            <PieChart />
          </div>
        </div>

      </header>
    </div>
  );
}
export default App;