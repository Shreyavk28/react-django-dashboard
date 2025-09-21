// frontend/src/StatCard.js
import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, unit }) => {
  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">
        {value} <span className="stat-unit">{unit}</span>
      </p>
    </div>
  );
};

export default StatCard;