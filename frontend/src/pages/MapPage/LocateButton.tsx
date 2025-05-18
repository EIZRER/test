import React from 'react';
import MyLocation from '@mui/icons-material/MyLocation';

interface LocateButtonProps {
  map: google.maps.Map | null;
  setUserLocation: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral | null>>;
  selectedCategory: string;
  fetchNearbyPlaces: (location: google.maps.LatLngLiteral, type: string) => void;
}

const LocateButton: React.FC<LocateButtonProps> = ({ map, setUserLocation, selectedCategory, fetchNearbyPlaces }) => {
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        map?.panTo(location);
        fetchNearbyPlaces(location, selectedCategory);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <button
      style={{
        position: 'absolute',
        top: '70%',
        left: '95%',
        backgroundColor: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0px 2px 6px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
      onClick={locateUser}
    >
      <MyLocation  />
    </button>
  );
};

export default LocateButton;