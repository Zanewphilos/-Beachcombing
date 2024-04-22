import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService/apiService_User'; 
import LoginPrompt from '../components/LoginPrompt';
import { UpdateUserData } from '../types/UserTypes'; 

interface User {
  
  email: string;
  userName: string;
  selfIntro: string;
  avatarUrl: string; 
  
}

// define AuthResponse interface
interface AuthResponse {
  token: string;
  
}

type AuthProviderProps = {
  children: ReactNode;
};

// define AuthContextType
interface AuthContextType {
  user: User | null;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, avatarUrl: string, selfIntro: string) => Promise<void>;
  update: (data: UpdateUserData) => Promise<void>;
  deleteUser: () => Promise<void>;
  logout: () => void;
  setUserInfo: (userInfo: UpdateUserData) => void;
}


const AuthContext = createContext<AuthContextType | null>(null);

// useauth hook
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    }
  }, []);

  const fetchUserInfo = async (token: string) => {
    try {
      const userInfo: User = await apiService.getUserInfo(token);
      setUser(userInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError('Unable to fetch user information');
    }
  };
  
  const login = async (email: string, password: string) => {
    setError('');
    try {
      const authResponse: AuthResponse = await apiService.login(email, password);
      localStorage.setItem('token', authResponse.token);
      await fetchUserInfo(authResponse.token);
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login');
    }
  };
  
  const update = async (data: UpdateUserData) => {
    setError('');
    try {
      const updatedUserInfo = await apiService.updateUser(data);
    setUserInfo(updatedUserInfo); 
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update');
    }
  };

  const setUserInfo = (userInfo: UpdateUserData) => {
    setUser(current => {
      if (current === null) {

        return null;
      }
      return {
        ...current, // Keep other properties unchanged.
        email: userInfo.email,
        userName: userInfo.userName, 
        selfIntro: userInfo.selfIntro, 
        // avatarUrl is not updated here, it retains its current value.
      };
    });
  };
  // delete user
  const deleteUser = async () => {
    setError('');
    try {
      await apiService.deleteUser();
      logout(); // Logout after deleting the user
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete');
    }
  };

  const register = async (username: string, email: string, password: string, avatarUrl: string, selfIntro: string) => {
  setError('');
  try {
    const authResponse = await apiService.register({ 
      UserName: username, 
      Email: email, 
      Password: password, 
      AvatarUrl: avatarUrl, 
      SelfIntro: selfIntro 
    });
    localStorage.setItem('token', authResponse.token);
    await fetchUserInfo(authResponse.token);
    return authResponse; // return the response
} catch (error) {
    console.error('Register error:', error);
    throw error; 
}

};

  
  const logout = () => {
    localStorage.removeItem('token'); // clear token
    setUser(null); 
    setError(''); 
  };

  const value = { user, error, login, register,update,setUserInfo, deleteUser, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};