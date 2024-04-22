import React from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css'; 
import BottomNav from '../components/BottomNav';
import { AuthProvider } from '../contexts/AuthContext';
import { LocationProvider } from '../contexts/LocationContext';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    // Wrap the entire app in the AuthProvider
    <AuthProvider>
      <LocationProvider>
      <div className="content">
          <Component {...pageProps} />
          <footer>
            <BottomNav />
          </footer>
        </div>
      </LocationProvider>
    </AuthProvider>
  );
};

export default MyApp;