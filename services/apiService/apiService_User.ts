// apiService_User.ts
import { User, AuthResponse, UpdateUserData ,ErrorResponse } from '../../types/UserTypes';

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  

  async function fetchWithAuth(url: string, options: RequestInit): Promise<any> {
    const response = await fetch(`${apiUrl}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Server responded with an error: ' + response.statusText);
    }
  
   //check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server did not return a JSON response.');
    }
  

    try {
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw new Error('An error occurred, and the server did not return a JSON response.');
    }
  }
  

  export const apiService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      return fetchWithAuth('/Account/Login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    
    register: async (data: { UserName: string; Email: string; Password: string; AvatarUrl: string; SelfIntro: string; }) => {
      return fetchWithAuth('/Account/Register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    updateUser: async (data: UpdateUserData): Promise<User> => {
      const response = await fetchWithAuth(`/Account/update`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    },
  
 
    deleteUser: async (): Promise<void> => {
      await fetchWithAuth(`/Account/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },

    getUserInfo: async (token: string): Promise<User> => {
      return fetchWithAuth('/Account/UserInfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
         },
  });
  
  }
  

};
