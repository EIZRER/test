import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useState, useRef } from 'react';
import PlaceInfoWindow from './PlaceInfoWindow';
import PlaceMarker from './PlaceMarker';
import Directions from './Directions'; 
import TravelModeSelector from './TravelModeSelector';
import DirectionsInfo from './DirectionsInfo';
import DirectionsForm from './DirectionsForm';
import AddEventForm from './AddEventForm';

import LocateButton from './LocateButton';
import StreetViewButton from './StreetViewButton';
import CategoryDropdown from './CategoryDropdown';
import SearchBar from './SearchBox';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const defaultCenter = {
  lat: 47.9221, 
  lng:  106.9155,
};


interface EventData {
  title: string;
  description: string;
  date: string;
  location: google.maps.LatLngLiteral;
}

const MapPage = () => {
  const [streetViewActive, setStreetViewActive] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('restaurant');
  const [travelMode, setTravelMode] = useState<any>('DRIVING'); // Use string for now
  const [route, setRoute] = useState<google.maps.DirectionsRoute | null>(null);
  const [origin, setOrigin] = useState('');
const [destination, setDestination] = useState('');
const [showDirectionsForm, setShowDirectionsForm] = useState(false);

//event
const [eventLocation, setEventLocation] = useState<google.maps.LatLngLiteral | null>(null);
const [events, setEvents] = useState<EventData[]>([]);



  


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

  // const handleSelectPlace = (place: any) => {
  //   const lat = place.geometry?.location?.lat();
  //   const lng = place.geometry?.location?.lng();

  //   if (!map || lat === undefined || lng === undefined) return;

  //   // map.panTo({ lat, lng });

  //   setSelectedPlace({
  //     lat,
  //     lng,
  //     name: place.name,
  //     vicinity: place.vicinity,
  //     icon: place.icon,
  //     rating: place.rating,
  //     user_ratings_total: place.user_ratings_total,
  //     opening_hours: place.opening_hours,
  //     photo: place.photos?.[0]?.getUrl({ maxWidth: 250, maxHeight: 100 }),
  //   });

  // };

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
  
  

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCy46LH04gj4QqeOl6mBN7fFId9Lq33m2s"
      libraries={['places']}
    >
      <div style={{ position: 'relative' }}>
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

          {/* Event Markers */}
          {events.map((event, index) => (
            <Marker
              key={`event-${index}`}
              position={event.location}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
              }}
              onClick={() => {
                setSelectedPlace({
                  lat: event.location.lat,
                  lng: event.location.lng,
                  name: event.title,
                  vicinity: event.description,
                  icon: '',
                });
              }}
            />
          ))}


          {/* Nearby Places / events marker*/}
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


          {/* Directions Form */}
          
      
            
         
  
  
  {/* Directions Component */}

         


          {origin && destination && map && (
            <Directions
              map={map}
              origin={origin}
              destination={destination}
              travelMode={travelMode}
              setRoute={setRoute}
            />
          )}

          


        </GoogleMap>

        {/* Travel Mode Selector */}
        
  
          {/* Layers Control */}
          {/* <LayersControl map={map} /> */}



        {/* Controls */}
        <StreetViewButton
          map={map}
          googleApiKey="AIzaSyCy46LH04gj4QqeOl6mBN7fFId9Lq33m2s"
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
            />

            {eventLocation && (
              <AddEventForm
                location={eventLocation}
                onSave={(newEvent) => {
                  setEvents([...events, newEvent]);
                  setEventLocation(null);
                }}
                onCancel={() => setEventLocation(null)}
              />
            )}


          
                {showDirectionsForm && (
                  <>  
                    <TravelModeSelector travelMode={travelMode} setTravelMode={setTravelMode} />

                    {route && <DirectionsInfo route={route} />}

                  </>
                )}
                
                {!showDirectionsForm && <SearchBar map={map} selectedPlace={selectedPlace}  />}

 

          </>
        )}
      </div>
    </LoadScript>
  );
};

export default MapPage;
