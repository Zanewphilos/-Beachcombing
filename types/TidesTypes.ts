interface TideExtreme {
    dt: number;
    date: string;
    height: number;
    type: 'High' | 'Low';
  }
  
    export interface TideResponse {
      status: number;
      requestLat: number;
      requestLon: number;
      responseLat: number;
      responseLon: number;
      atlas: string;
      station: string;
      extremes: TideExtreme[];
    }

    export interface ChartData {
      labels: string[]; 
      datasets: [{
        label: string; 
        data: number[]; 
        borderColor: string; 
        backgroundColor: string; 
      }];
    }