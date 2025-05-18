import { useEffect } from 'react';

interface DirectionsProps {
  map: google.maps.Map | null;
  origin: google.maps.LatLngLiteral | string;
  destination: google.maps.LatLngLiteral | string;
  travelMode: google.maps.TravelMode;
  setRoute?: (route: google.maps.DirectionsRoute) => void;
}

const Directions = ({
  map,
  origin,
  destination,
  travelMode,
  setRoute,
}: DirectionsProps) => {
  useEffect(() => {
    if (!origin || !destination || !map) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin,
        destination,
        travelMode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
          if (setRoute) {
            setRoute(result.routes[0]);
          }
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );

    // Optional: clean up renderer on unmount
    return () => {
      directionsRenderer.setMap(null);
    };
  }, [origin, destination, travelMode, map]);

  return null;
};

export default Directions;