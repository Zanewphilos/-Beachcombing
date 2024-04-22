export interface User {
    email: string;
    userName: string;
    selfIntro: string;
    avatarUrl: string;
  }
  
  export interface UpdateUserData {
    email: string;
    userName: string;
    selfIntro: string;
  }


  export interface AuthResponse {
    token: string;
  }
  
  export interface ErrorResponse {
    detail: string;
  }
  