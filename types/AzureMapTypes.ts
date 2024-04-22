export interface GeocodeApiResponse {
    addresses: [
      {
        address: {
          municipality: string; 
          freeformAddress: string; 

          countrySubdivisionName: string; 
          country: string;
        };
      }
    ];
  }