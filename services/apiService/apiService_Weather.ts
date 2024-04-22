import { WeatherResponse } from "../../types/WeatherTypes";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;



export async function apiService_Weather(latitude: number, longitude: number): Promise<WeatherResponse> {

  try {
    const url = `${baseUrl}/Weather?latitude=${latitude}&longitude=${longitude}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data: WeatherResponse = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}