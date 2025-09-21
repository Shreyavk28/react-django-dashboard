// frontend/src/BarChart.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

// ADD THESE IMPORTS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ADD THIS REGISTRATION CALL
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/daily-forecast/');
        const data = res.data;
        setChartData({
          labels: data.daily.time.map(date => new Date(date).toLocaleDateString('en-IN', { weekday: 'short' })),
          datasets: [
            {
              label: 'Max Temperature (°C)',
              data: data.daily.temperature_2m_max,
              backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching daily data:", error);
      }
    };
    fetchData();
  }, []);

   return (
    <>
      {chartData ? <Bar data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Daily Maximum Temperature' }}}} /> : <p>Loading Daily Forecast...</p>}
    </>
  );
};

export default BarChart;