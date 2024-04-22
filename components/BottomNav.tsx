
import React, { useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';
import styles from '../styles/BottomNav.module.css'; 

const BottomNav: React.FC = () => {
  const router = useRouter();
  const [value, setValue] = React.useState(router.pathname);
  


  // Update the component state based on the current pathname
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setValue(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
  
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(newValue);
  };

  
  return (
    <BottomNavigation value={value} 
    onChange={handleChange}
    className={styles.bottomNav}>
      <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
      <BottomNavigationAction label="Explore" value="/explore" icon={<ExploreIcon />} />
      <BottomNavigationAction label="Cleanup" value="/cleanup" icon={<ExploreIcon />} />
      <BottomNavigationAction label="Favorites" value="/favorites" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Profile" value="/profile" icon={<AccountCircleIcon />} />
    </BottomNavigation>
    
  );
};

export default BottomNav;
