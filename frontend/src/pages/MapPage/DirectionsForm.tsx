import React, { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import DirectionsIcon from '@mui/icons-material/Directions';
import ClearIcon from '@mui/icons-material/Clear';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { useEffect } from 'react';

// ...



interface Place {
  lat: number;
  lng: number;
  name: string;
  vicinity?: string;
  icon?: string;
  formatted_address: string;
}

interface Props {
  origin: string;
  destination: string;
  setOrigin: (value: string) => void;
  setDestination: (value: string) => void;
  onSwap: () => void;
  travelMode: google.maps.TravelMode;
  setTravelMode: (mode: google.maps.TravelMode) => void;
  showDirectionsForm: boolean;
  setShowDirectionsForm: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPlace: Place | null;
  userLocation: google.maps.LatLngLiteral | null;
}

const DirectionsForm: React.FC<Props> = ({
  origin,
  destination,
  setOrigin,
  setDestination,
  onSwap,
  travelMode,
  setTravelMode,
  showDirectionsForm,
  setShowDirectionsForm,
  selectedPlace,
  userLocation,
}) => {

  
useEffect(() => {
  if (selectedPlace?.formatted_address) {
    setDestination(selectedPlace.formatted_address);
  }
}, [selectedPlace]);


  const travelModes = [
    { mode: 'DRIVING', label: <DirectionsCarIcon /> },
    { mode: 'TRANSIT', label: <DirectionsTransitIcon /> },
    { mode: 'WALKING', label: <DirectionsWalkIcon /> },
    { mode: 'BICYCLING', label: <DirectionsBikeIcon /> },
  ];
  const [originAutoComplete, setOriginAutoComplete] = useState<google.maps.places.Autocomplete | null>(null);
const [destinationAutoComplete, setDestinationAutoComplete] = useState<google.maps.places.Autocomplete | null>(null);

console.log('setSelectedPlace in the directionForm', selectedPlace);
console.log('origin in the directionForm', origin); 

  // "Get Directions" button
  if (!showDirectionsForm) {
    return (
      <button
        onClick={() => setShowDirectionsForm(true)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          maxWidth: '55px',
          width: '100%',
          zIndex: 10,
          backgroundColor: '#2563eb', // Tailwind's blue-600
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <DirectionsIcon  />
      </button>
    );
  }

  // Directions form
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '380px',
        position: 'absolute',
        top: '10px',
        left: '18px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* ✕ Close button */}
      <button
        onClick={() => setShowDirectionsForm(false)}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'transparent',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#aaa',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = '#f87171')}
        onMouseOut={(e) => (e.currentTarget.style.color = '#aaa')}
      >
        <ClearIcon />
      </button>

      {/* Travel mode buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {travelModes.map(({ mode, label }) => {
          const isActive =
            travelMode ===
            google.maps.TravelMode[mode as keyof typeof google.maps.TravelMode];
          return (
            <button
              key={mode}
              onClick={() =>
                setTravelMode(
                  google.maps.TravelMode[mode as keyof typeof google.maps.TravelMode]
                )
              }
              style={{
                fontSize: '24px',
                padding: '8px',
                borderRadius: '9999px',
                backgroundColor: isActive ? '#bfdbfe' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Inputs */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Autocomplete onLoad={setOriginAutoComplete} onPlaceChanged={() => {
        if (originAutoComplete) {
          const place = originAutoComplete.getPlace();
          if (place.formatted_address) setOrigin(place.formatted_address);
        }
      }}>
        <input
          type="text"
          placeholder="Enter starting point"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          style={{
            width: '60%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </Autocomplete>

     <Autocomplete
  onLoad={setDestinationAutoComplete}
  onPlaceChanged={() => {
    if (destinationAutoComplete) {
      const place = destinationAutoComplete.getPlace();
      if (place.formatted_address) {
        setDestination(place.formatted_address);
      }
    }
  }}
>
  <input
    type="text"
    placeholder="Enter destination"
    value={destination}
    onChange={(e) => {
      setDestination(e.target.value);
    }}
    style={{
      width: '60%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    }}
  />
</Autocomplete>




        <button
          onClick={onSwap}
          title="Swap"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#e5e7eb',
            borderRadius: '9999px',
            padding: '4px 8px',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d1d5db')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
        >
          ⬍
        </button>
      </div>
    </div>
  );
};

export default DirectionsForm;