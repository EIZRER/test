import { useState, useRef, useEffect, useCallback } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface Place {
  lat: number;
  lng: number;
  name: string;
  vicinity?: string;
  icon?: string;
}

interface Props {
  map: google.maps.Map | null;
  selectedPlace: Place | null; // selectedPlace can either be a Place object or null
}

interface PlaceWithPhoto extends google.maps.places.AutocompletePrediction {
  photoUrl?: string;
  secondaryText?: string;
}

let debounceTimeout: NodeJS.Timeout;

const SearchBar = ({ map ,  selectedPlace }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<PlaceWithPhoto[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  // const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!autocompleteServiceRef.current && window.google) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
    if (!placesServiceRef.current && map) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    }

    // Auto-focus on page load
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Load recent searches from localStorage
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(savedSearches);
  }, [map]);

  // If selectedPlace exists, center map and place a marker
  useEffect(() => {
    console.log('Selected Place:', selectedPlace);
    if (selectedPlace && map) {
      const position = new google.maps.LatLng(selectedPlace.lat, selectedPlace.lng);
  
      map.panTo(position);
      map.setZoom(17);
  
      // setMarker((prevMarker) => {
      //   if (prevMarker) {
      //     prevMarker.setMap(null);
      //   }
  
      //   const newMarker = new google.maps.Marker({
      //     position,
      //     map: map,
      //     title: selectedPlace.name,
      //   });
  
      //   return newMarker;
      // });
  
      setInputValue(selectedPlace.name);
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  }, [selectedPlace, map]);
  
  const fetchSuggestions = useCallback((value: string) => {
    if (!value) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    if (autocompleteServiceRef.current) {
      setLoading(true);
      autocompleteServiceRef.current.getPlacePredictions({ input: value }, (predictions, status) => {
        setLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          if (placesServiceRef.current) {
            const fetchDetailsPromises = predictions.map(pred => new Promise<PlaceWithPhoto>(resolve => {
              placesServiceRef.current!.getDetails(
                { placeId: pred.place_id, fields: ['photos', 'formatted_address'] },
                (place, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve({
                      ...pred,
                      photoUrl: place?.photos?.[0]?.getUrl({ maxWidth: 80, maxHeight: 80 }),
                      secondaryText: place?.formatted_address || '',
                    });
                  } else {
                    resolve({ ...pred });
                  }
                }
              );
            }));

            Promise.all(fetchDetailsPromises).then((results) => {
              setSuggestions(results);
            });
          }
        } else {
          setSuggestions([]);
        }
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setActiveSuggestionIndex(-1);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchSuggestions(value);
    }, 300); // 300ms delay
  };

  const handleSelectSuggestion = (placeId: string, description: string) => {
    if (placesServiceRef.current && map) {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: ['name', 'geometry'],
      };
      placesServiceRef.current.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          map.panTo(place.geometry.location);
          map.setZoom(17); // zoom closer

          // if (marker) {
          //   marker.setMap(null);
          // }

          // const newMarker = new google.maps.Marker({
          //   position: place.geometry.location,
          //   map: map,
          //   title: place.name,
          // });
          // setMarker(newMarker);

          // Save to recent searches
          const updatedSearches = [description, ...recentSearches.filter(s => s !== description)].slice(0, 5);
          setRecentSearches(updatedSearches);
          localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

          setSuggestions([]);
          setInputValue(description);
          setActiveSuggestionIndex(-1);
        }
      });
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[activeSuggestionIndex];
      handleSelectSuggestion(selected.place_id, selected.description);
    } else if (e.key === '/' && inputRef.current) {
      // Press '/' to focus the input
      inputRef.current.focus();
    }
  };

  const clearInput = () => {
    setInputValue('');
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
  };

  const highlightMatch = (text: string, input: string) => {
    const regex = new RegExp(`(${input})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      part.toLowerCase() === input.toLowerCase() ? (
        <strong key={idx}>{part}</strong>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '16px', 
      position: 'absolute',
      top: '10px',
      left: '2%',
      
      zIndex: 1000,
      width: '400px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '12px 16px',
        borderRadius: '16px',
        boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        position: 'relative',
        transition: '0.3s ease',
        transform: 'scale(1)',
      }}>
        {/* <span style={{ color: '#888', fontSize: '22px' }}>🔍</span> */}
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Google Maps..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            borderRadius: '12px',
            transition: '0.3s ease',
            boxShadow: activeSuggestionIndex !== -1 ? '0px 0px 10px rgba(63,81,181,0.5)' : 'none',
          }}
        />
        {inputValue && (
          <span onClick={clearInput} style={{
            cursor: 'pointer',
            fontSize: '20px',
            color: '#aaa',
          }}>
            <ClearIcon />
          </span>
        )}
        {loading && <div style={{ fontSize: '16px', color: '#888' }}>⏳</div>}
      </div>

      {suggestions.length > 0 && (
        <div style={{
          marginTop: '10px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          maxHeight: '300px',
          overflowY: 'auto',
        }}>
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSelectSuggestion(suggestion.place_id, suggestion.description)}
              style={{
                padding: '12px 14px',
                cursor: 'pointer',
                backgroundColor: index === activeSuggestionIndex ? '#e8f0fe' : 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'background 0.3s',
              }}
              onMouseEnter={() => setActiveSuggestionIndex(index)}
              onMouseLeave={() => setActiveSuggestionIndex(-1)}
            >
              {suggestion.photoUrl && (
                <img
                  src={suggestion.photoUrl}
                  alt=""
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    boxShadow: '0px 2px 6px rgba(0,0,0,0.3)',
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {highlightMatch(suggestion.description, inputValue)}
                </div>
                {suggestion.secondaryText && (
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                    {suggestion.secondaryText}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      <div style={{
        margin: '12px',
        paddingLeft: '10px',
        color: '#555',
        fontSize: '14px',
      }}>
        <strong>Recent Searches:</strong>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginTop: '8px',
        }}>
          {recentSearches.map((search, index) => (
            <div
              key={index}
              onClick={() => setInputValue(search)}
              style={{
                backgroundColor: '#f5f5f5',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
            >
              {search}
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes bounceMarker {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
          }
          @keyframes glowSearch {
            0% { box-shadow: 0px 0px 8px rgba(63,81,181,0.5); }
            100% { box-shadow: 0px 0px 12px rgba(63,81,181,0.8); }
          }
        `}
      </style>
    </div>
  );
};

export default SearchBar;
