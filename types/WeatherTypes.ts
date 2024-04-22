export interface WeatherResponse {
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind_speed: number;
    wind_gust: number;
    uvi: number;
    visibility: number;
    clouds: number;
  };
  hourly: Array<{
    dt: number;
    temp: number;
    feels_like: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number; 
    wind_speed: number;
    wind_gust: number;
  }>;
  daily: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    wind_speed: number;
    wind_gust: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: number;
    pop: number;
    rain?: number; 
    snow?: number; 
    uvi: number;
  }>;
  alerts?: Array<{
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
  }>;
  }