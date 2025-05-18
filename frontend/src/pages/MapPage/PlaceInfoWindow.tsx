import { InfoWindow } from '@react-google-maps/api';

interface PlaceInfoWindowProps {
  place: {
    lat: number;
    lng: number;
    name: string;
    vicinity?: string;
    icon?: string;
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: { open_now: boolean };
    photo?: string;
    infoWindowOpen?: boolean;
  };
  onClose: () => void;
}

const PlaceInfoWindow: React.FC<PlaceInfoWindowProps> = ({ place, onClose }) => {
  const Plat = place.lat + 0.0003;
  
  // Only show the InfoWindow if infoWindowOpen is true or undefined
  if (place.infoWindowOpen === false) {
    return null;
  }

  return (
    <InfoWindow position={{ lat: Plat, lng: place.lng }} onCloseClick={onClose}>
      <div style={{ width: '250px' }}>
        {place.photo && (
          <img
            src={place.photo}
            alt="Place"
            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
          />
        )}
        <h3 style={{ margin: '8px 0 4px' }}>{place.name}</h3>
        {place.rating && (
          <div style={{ fontSize: '14px', color: '#555' }}>
            ⭐ {place.rating} ({place.user_ratings_total} reviews)
          </div>
        )}
        <p style={{ fontSize: '13px', color: '#777' }}>{place.vicinity}</p>
        {place.opening_hours && (
          <p style={{ fontSize: '13px', color: place.opening_hours.open_now ? 'green' : 'red' }}>
            {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
          </p>
        )}
      </div>
    </InfoWindow>
  );
};

export default PlaceInfoWindow;
