import { Marker } from '@react-google-maps/api';

interface Photo {
  getUrl: (options: { maxWidth: number; maxHeight: number }) => string;
}

interface Place {
  place_id: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  name: string;
  vicinity?: string;
  icon?: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { open_now: boolean };
  photos?: Photo[];
}

interface PlaceMarkerProps {
  place: Place;
  map: google.maps.Map | null;
  index: number;
  onClick: (place: {
    lat: number;
    lng: number;
    name: string;
    vicinity?: string;
    icon?: string;
    formatted_address?: string;
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: { open_now: boolean };
    photo?: string;
  }) => void;
}

const PlaceMarker: React.FC<PlaceMarkerProps> = ({ place, map, index, onClick }) => {
  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();

  const handleClick = () => {
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(16);
    }

    const service = new google.maps.places.PlacesService(map!);
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: place.place_id,
      fields: [
        'formatted_address',
        'name',
        'geometry',
        'vicinity',
        'icon',
        'rating',
        'user_ratings_total',
        'opening_hours',
        'photos',
      ],
    };

    service.getDetails(request, (details, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && details) {
        const normalizedOpeningHours =
          details.opening_hours?.open_now !== undefined
            ? { open_now: details.opening_hours.open_now }
            : undefined;

        onClick({
          lat,
          lng,
          name: details.name || place.name,
          vicinity: details.vicinity,
          icon: details.icon,
          formatted_address: details.formatted_address,
          rating: details.rating,
          user_ratings_total: details.user_ratings_total,
          opening_hours: normalizedOpeningHours,
          photo: details.photos?.[0]?.getUrl({ maxWidth: 250, maxHeight: 100 }),
        });
      } else {
        const fallbackOpeningHours =
          place.opening_hours?.open_now !== undefined
            ? { open_now: place.opening_hours.open_now }
            : undefined;

        onClick({
          lat,
          lng,
          name: place.name,
          vicinity: place.vicinity,
          icon: place.icon,
          formatted_address: place.formatted_address,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          opening_hours: fallbackOpeningHours,
          photo: place.photos?.[0]?.getUrl({ maxWidth: 250, maxHeight: 100 }),
        });
      }
    });
  };

  return (
    <Marker
      position={{ lat, lng }}
      icon={{
        url: place.icon || 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(30, 30),
      }}
      onClick={handleClick}
    />
  );
};

export default PlaceMarker;