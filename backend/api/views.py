# backend/api/views.py
import requests
from rest_framework.views import APIView
from rest_framework.response import Response

class WeatherData(APIView):
    def get(self, request, format=None):
        # THE FIX: Add 'weathercode' to the list of hourly data
        url = "https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&hourly=temperature_2m,relativehumidity_2m,weathercode&current_weather=true"
        try:
            r = requests.get(url)
            r.raise_for_status()
            data = r.json()
            return Response(data)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=503)
        
class DailyForecastData(APIView):
    def get(self, request, format=None):
        # NEW: Add `daily` parameters for max/min temp and precipitation
        url = "https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&daily=temperature_2m_max,precipitation_sum&timezone=auto"
        try:
            r = requests.get(url)
            r.raise_for_status()
            data = r.json()
            return Response(data)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=503)