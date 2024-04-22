import { TideResponse } from "../../types/TidesTypes";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;



  export async function apiService_Tide(latitude: number, longitude: number): Promise<TideResponse> {
    try {
      const url = `${baseUrl}/Tides?latitude=${latitude}&longitude=${longitude}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch tide data');
      }
      const data: TideResponse = await response.json();
      return data; 
    } catch (error) {
      console.error("Error fetching tide data:", error);
      throw error;
    }
  }