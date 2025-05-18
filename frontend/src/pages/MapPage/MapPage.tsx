import { GoogleMap, LoadScript, Marker, StreetViewPanorama } from '@react-google-maps/api';
import { useEffect, useState, useRef, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import PlaceInfoWindow from './PlaceInfoWindow';
import PlaceMarker from './PlaceMarker';
import Directions from './Directions'; 
import TravelModeSelector from './TravelModeSelector';
import DirectionsInfo from './DirectionsInfo';
import DirectionsForm from './DirectionsForm';
import AddEventForm from './AddEventForm';
import CreateEventButton from './CreateEventButton';
import { fetchEvents, createEvent } from '../../services/api';
import type { Event, EventCategory } from '../../types/event';

import LocateButton from './LocateButton';
import StreetViewButton from './StreetViewButton';
import CategoryDropdown from './CategoryDropdown';
import SearchBar from './SearchBox';

const containerStyle = {
  width: '100%',
  height: '100%',
  maxWidth: '100vw',
  overflow: 'hidden'
};

const defaultCenter = {
  lat: 47.9221, 
  lng: 106.9155,
};

const libraries: ("places")[] = ["places"];

// Map category to icon URL
const categoryIconMap: Record<string, string> = {
  'Фестиваль': 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
  'Урлаг': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  'Сайн дурын ажиллагаа': 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
  'Боловсрол': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  'Тэмдэглэлт өдөр': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  'Бизнес эвэнт': 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png',
  'Шинжлэх ухаан': 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  'Шоу тоглолт': 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
  'Амралт зуг': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  'default': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
};

interface EventData {
  title: string;
  description: string;
  date: string;
  location: google.maps.LatLngLiteral;
}

interface MapPageProps {
  initialCreateEvent?: boolean;
  onEventAdded?: (event: Event) => void;
}

const MapPage: React.FC<MapPageProps> = ({ 
  initialCreateEvent = false,
  onEventAdded
}) => {
  const [streetViewActive, setStreetViewActive] = useState(false);
  // const [streetViewPosition, setStreetViewPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('restaurant');
  const [travelMode, setTravelMode] = useState<any>('DRIVING');
  const [route, setRoute] = useState<google.maps.DirectionsRoute | null>(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showDirectionsForm, setShowDirectionsForm] = useState(false);

  // Event states
  const [eventLocation, setEventLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(initialCreateEvent);
  console.log(isCreatingEvent);

  const mapRef = useRef<google.maps.Map | null>(null);

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    mapRef.current = mapInstance;
  };

  const fetchNearbyPlaces = (location: google.maps.LatLngLiteral, type: string) => {
    if (!map) return;

    const service = new google.maps.places.PlacesService(map);
    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius: 3000,
      type,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaces(results);
      }
    });
  };

  useEffect(() => {
    if (userLocation) {
      fetchNearbyPlaces(userLocation, selectedCategory);
    }
  }, [selectedCategory, userLocation]);

  // Fetch events from API
  const fetchAllEvents = useCallback(async () => {
    try {
      const data = await fetchEvents();
      // Type assertion to ensure compatibility
      setEvents(data as Event[]);
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Failed to load events');
    }
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  // Effect to handle initialCreateEvent prop changes
  useEffect(() => {
    if (initialCreateEvent) {
      setIsCreatingEvent(true);
    }
  }, [initialCreateEvent]);

  // Fix for street view panoarama
  

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!map || !event.latLng) return;
  
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

      // Set location for AddEventForm
  setEventLocation({ lat, lng });

  // Optionally pan to clicked location

    map.panTo({ lat, lng });
  
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };
  
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const placeResult = results[0];
  
        // If placeId exists, fetch full place details
        if (placeResult.place_id) {
          const service = new google.maps.places.PlacesService(map);
  
          const request: google.maps.places.PlaceDetailsRequest = {
            placeId: placeResult.place_id,
            fields: [
              'name',
              'formatted_address',
              'vicinity',
              'geometry',
              'icon',
              'rating',
              'user_ratings_total',
              'opening_hours',
              'photos',
              'place_id',
            ],
          };
  
          service.getDetails(request, (placeDetails, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
              setSelectedPlace({
                lat: placeDetails.geometry?.location?.lat(),
                lng: placeDetails.geometry?.location?.lng(),
                formatted_address: placeDetails.formatted_address,
                name: placeDetails.name,
                vicinity: placeDetails.vicinity || placeDetails.formatted_address,
                icon: placeDetails.icon,
                rating: placeDetails.rating,
                user_ratings_total: placeDetails.user_ratings_total,
                opening_hours: placeDetails.opening_hours,
                photo: placeDetails.photos?.[0]?.getUrl({ maxWidth: 250, maxHeight: 100 }),
              });
  
            }
          });
        } else {
          // fallback: no place_id, just basic info
          setSelectedPlace({
            lat,
            lng,
            name: placeResult.formatted_address || 'Selected Location',
            vicinity: '',
            icon: '',
          });
  
 ;
        }
      }
    });
  };

  const handleCreateEvent = async (formData: FormData) => {
    try {
      // Use the API service to create the event
      const response = await createEvent(formData);
      const newEvent = response.data;
      
      // Update events list with the new event
      setEvents(prevEvents => [...prevEvents, newEvent]);
      
      // Call the callback to update the parent component (HomePage)
      if (onEventAdded) {
        onEventAdded(newEvent);
      }
      
      // Close the form
      setEventLocation(null);
      setIsCreatingEvent(false);
      
      // Success feedback
      message.success(`Event "${newEvent.title}" was created successfully`);
      
      // Pan to the new event location
      if (map && newEvent.location) {
        map.panTo({
          lat: Number(newEvent.location.latitude),
          lng: Number(newEvent.location.longitude)
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      message.error('Failed to create event. Please try again.');
    }
  };

  const handleCreateEventButtonClick = () => {
    setIsCreatingEvent(true);
  };
  
  const getEventIcon = (category: string) => {
    return categoryIconMap[category] || categoryIconMap.default;
  };

  // Get API key from environment variables
  // const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCy46LH04gj4QqeOl6mBN7fFId9Lq33m2s";

  return (
    // <div className="relative w-full h-[65vh] md:h-[70vh] overflow-hidden border rounded-lg shadow-sm">
      <LoadScript
         googleMapsApiKey="AIzaSyC2cj8_UP46-rxKwVrRvotGRQn8Qv3OEEI"
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || defaultCenter}
          zoom={13}
          onLoad={onLoad}
          
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {/* User Marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                // scaledSize: new google.maps.Size(35, 35),
              }}
            />
          )}

          {/* Selected Place Marker */}
          {selectedPlace && (
            <Marker
              position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new google.maps.Size(35, 35),
              }}
              animation={google.maps.Animation.DROP}
            />
          )}

          {/* Event Markers - with category-specific icons */}
          {events.map((event) => (
            <Marker
              key={event._id}
              position={{ 
                lat: Number(event.location.latitude), 
                lng: Number(event.location.longitude) 
              }}
              icon={{
                url: getEventIcon(event.category),
                scaledSize: new google.maps.Size(35, 35),
              }}
              onClick={() => {
                setSelectedPlace({
                  lat: Number(event.location.latitude),
                  lng: Number(event.location.longitude),
                  name: event.title,
                  vicinity: event.description,
                  icon: '',
                  event: event // Pass the full event object for the info window
                });
              }}
            />
          ))}

          {/* Nearby Places markers */}
          {places.map((place, index) => (
            <PlaceMarker
              key={index}
              place={place}
              map={map}
              index={index}
              onClick={setSelectedPlace}
            />
          ))}

          {/* Info Window */}
          {selectedPlace && (
            <PlaceInfoWindow place={selectedPlace} onClose={() => setSelectedPlace(null)} />
          )}

          {/* Directions */}
          {origin && destination && map && (
            <Directions
              map={map}
              origin={origin}
              destination={destination}
              travelMode={travelMode}
              setRoute={setRoute}
            />
          )}

          <CreateEventButton onClick={handleCreateEventButtonClick} />
        </GoogleMap>

        {/* Controls - Positioned absolutely over the map */}
        {/* <div className="absolute top-4 right-4 z-10 flex flex-col gap-2"> */}
        <StreetViewButton
          map={map}
          googleApiKey="AIzaSyC2cj8_UP46-rxKwVrRvotGRQn8Qv3OEEI"
          streetViewActive={streetViewActive}
          setStreetViewActive={setStreetViewActive}
        />
          
          {!streetViewActive && (
            <>
              <LocateButton
              map={map}
              setUserLocation={setUserLocation}
              selectedCategory={selectedCategory}
              fetchNearbyPlaces={fetchNearbyPlaces}
            />

              <CategoryDropdown
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </>
          )}
        {/* </div> */}

        {/* Add more controls on the left */}
        {/* <div className="absolute top-4 left-4 z-10"> */}
          {!streetViewActive && !showDirectionsForm && (
            <SearchBar map={map} selectedPlace={selectedPlace} />
          )}
        {/* </div> */}

        {/* Bottom controls */}
        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4"> */}
          {!streetViewActive && (
            <>
                <DirectionsForm
                    origin={origin}
                    destination={destination}
                    setOrigin={setOrigin}
                    setDestination={setDestination}
                    onSwap={handleSwap}
                    travelMode={travelMode}
                    setTravelMode={setTravelMode}
                    setShowDirectionsForm={setShowDirectionsForm}
                    showDirectionsForm={showDirectionsForm}
                    selectedPlace={selectedPlace}
                    userLocation={userLocation}
                  />

              {showDirectionsForm && (
                <>  
                  <TravelModeSelector travelMode={travelMode} setTravelMode={setTravelMode} />
                  {route && <DirectionsInfo route={route} />}
                </>
              )}
            </>
          )}
        {/* </div> */}

        {/* Event Form Modal */}
        {isCreatingEvent && eventLocation && (
          <AddEventForm
            location={eventLocation}
            onSave={handleCreateEvent}
            onCancel={() => {
              setEventLocation(null);
              setIsCreatingEvent(false);
            }}
          />
        )}

        {/* Street View container */}
        {/* <div
          id="street-view"
          className="absolute inset-0 z-0"
          style={{
            display: streetViewActive ? 'block' : 'none',
          }}
        /> */}
      </LoadScript>
    // </div>
  );
};

export default MapPage;
