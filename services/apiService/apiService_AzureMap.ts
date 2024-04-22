import { GeocodeApiResponse } from "../../types/AzureMapTypes";
import { LocationState } from "../../types/LocationTypes";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;



export async function fetchLocationDetails(latitude: number, longitude: number): Promise<LocationState> {
  try {
    const url = `${baseUrl}/MapsProxy/GeocodeByCoordinates?latitude=${latitude}&longitude=${longitude}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch district name');
    }
    const data: GeocodeApiResponse = await response.json();

    const { freeformAddress,  municipality, countrySubdivisionName, country } = data.addresses[0].address;
    return {
      fullAddress: freeformAddress || "Unknown",
      district: municipality || "Unknown",
      state: countrySubdivisionName || "Unknown",
      country: country || "Unknown",
    };
  } catch (error) {
    console.error("Error fetching location details:", error);
    return {
      fullAddress: "Error",
      district: "Error",
      state: "Error",
      country: "Error",
    };
  }
}