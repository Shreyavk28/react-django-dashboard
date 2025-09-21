// frontend/src/PieChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// CHANGE THIS: Import Doughnut instead of Pie
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const getWeatherCategory = (code) => {
    if (code <= 1) return 'Clear';
    if (code <= 3) return 'Cloudy';
    if (code >= 51 && code <= 67) return 'Rain';
    if (code >= 80 && code <= 82) return 'Rain';
    if (code >= 95) return 'Thunderstorm';
    if (code >= 45 && code <= 48) return 'Fog';
    return 'Other';
};

const PieChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/weather-data/');
        const data = res.data;

        // THE FIX: Check if data and its properties exist before using them
        if (data && data.hourly && data.hourly.weathercode) {
          const hourlyWeatherCodes = data.hourly.weathercode.slice(0, 24);

          const categoryCounts = hourlyWeatherCodes.reduce((acc, code) => {
            const category = getWeatherCategory(code);
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});

          const labels = Object.keys(categoryCounts);
          const values = Object.values(categoryCounts);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: '# of Hours',
                data: values,
                backgroundColor: [
                  'rgba(255, 206, 86, 0.6)', // Clear
                  'rgba(153, 102, 255, 0.6)',// Cloudy
                  'rgba(54, 162, 235, 0.6)', // Rain
                  'rgba(255, 99, 132, 0.6)', // Thunderstorm
                  'rgba(201, 203, 207, 0.6)',// Fog
                ],
                borderColor: '#ffffff'
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching data for pie chart:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weather Conditions in Next 24 Hours' },
    },
  };

 
  return (
    <div className="chart-wrapper">
      {/* CHANGE THIS: Use the Doughnut component */}
      {chartData ? <Doughnut data={chartData} options={options} /> : <p>Loading Conditions Chart...</p>}
    </div>
  );
};

export default PieChart;