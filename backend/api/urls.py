# backend/api/urls.py
from django.urls import path
from .views import WeatherData, DailyForecastData # Add DailyForecastData

urlpatterns = [
    path('weather-data/', WeatherData.as_view(), name='weather-data'),
    path('daily-forecast/', DailyForecastData.as_view(), name='daily-forecast'), # Add this line
]