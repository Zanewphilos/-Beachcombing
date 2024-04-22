// components/AzureMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as atlas from 'azure-maps-control';
import { useLocation } from '../contexts/LocationContext';
import { useRouter } from 'next/router';
import styles from '../styles/AzureMap.module.css';

const AzureMap = React.memo(function AzureMap(props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const { updateLocation } = useLocation();
  const router = useRouter();
  const [mapInstance, setMapInstance] = useState<atlas.Map | null>(null);

  useEffect(() => {
    const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_MAPS_SUBSCRIPTION_KEY;
    if (mapRef.current && subscriptionKey) {
      const map = new atlas.Map(mapRef.current, {
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey,
        },
        center: [-1.415615, 55.069452],
        zoom: 7,
        view: 'Auto',
        interactive: true,
      });
      // map.setCamera({
      //   maxZoom: 7,
      //   minZoom: 7,
      // });
      // user setcamera for cost saving reason
      setMapInstance(map);

      map.events.add('ready', () => {
        map.controls.add(new atlas.control.ZoomControl(), {
          position: atlas.ControlPosition.TopRight,
        });

        // 监听地图点击事件
        map.events.add('click', (e) => {
          if (!e.position) return; // 确保mapInstance不为null，并且e.position已定义
          const coords = e.position;
          const pixel = map.positionsToPixels([coords])[0];
          if (coords && markerRef.current) { // 确保pixel和markerRef.current都不为null
            markerRef.current.style.left = `${pixel[0]}px`;
            markerRef.current.style.top = `${pixel[1]}px`;
            markerRef.current.style.visibility = 'visible';

            const isConfirmed = window.confirm("Are you sure you want to select this place?");
            if (isConfirmed) {
              //user confirmed
              
              
              // const position = map.pixelsToPositions([coords])[0];
              //coords is already a right position
              if (coords) { 
                updateLocation(coords[1], coords[0]);
                router.push('/');
              }
            } else {
              // user cancelled
              markerRef.current.style.visibility = 'hidden';
            }
          }
        });
      });

      return () => {
        if (map) map.dispose();
      };
    }
  }, [updateLocation, router]);

  return (
    <div className={styles.mapContainerStyle}>
      <div ref={mapRef} className={styles.mapStyle}></div>
      <div ref={markerRef} className={styles.marker}>📍</div>
      
    </div>
  );
});

export default AzureMap;