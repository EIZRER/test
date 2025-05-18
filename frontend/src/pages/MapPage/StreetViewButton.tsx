import React, { useState, useRef } from 'react';

interface StreetViewButtonProps {
  map: google.maps.Map | null;
  googleApiKey: string;
  streetViewActive: boolean;
  setStreetViewActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const StreetViewButton: React.FC<StreetViewButtonProps> = ({ map, googleApiKey, streetViewActive, setStreetViewActive }) => {
  // Remove local useState for streetViewActive

  // const [streetViewActive, setStreetViewActive] = useState(false);
  const [placeName, setPlaceName] = useState<string>('');
  const [captureDate, setCaptureDate] = useState<string>('');
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  const openStreetView = async () => {
    if (map) {
      const center = map.getCenter();
      if (!center) return;

      if (!panoramaRef.current) {
        panoramaRef.current = new google.maps.StreetViewPanorama(
          document.getElementById('street-view') as HTMLElement,
          {
            position: center,
            pov: {
              heading: 270,
              pitch: 0,
            },
            visible: true,
            addressControl: true,
            linksControl: true,
            panControl: true,
            enableCloseButton: false,
            fullscreenControl: true,
            zoomControl: true,
          }
        );
        map.setStreetView(panoramaRef.current);

        panoramaRef.current.addListener('pano_changed', () => {
          fetchPanoramaMetadata();
        });
      } else {
        panoramaRef.current.setPosition(center);
        panoramaRef.current.setVisible(true);
      }

      await fetchPlaceName(center.lat(), center.lng());
      await fetchPanoramaMetadata();

      setStreetViewActive(true);
    }
  };

  const closeStreetView = () => {
    if (panoramaRef.current) {
      panoramaRef.current.setVisible(false);
    }
    setStreetViewActive(false);
  };

  const fetchPlaceName = async (lat: number, lng: number) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      setPlaceName(data.results[0].formatted_address);
    } else {
      setPlaceName('Unknown Location');
    }
  };

  const fetchPanoramaMetadata = async () => {
    if (!map) return;
    const center = map.getCenter();
    if (!center) return;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/streetview/metadata?location=${center.lat()},${center.lng()}&key=${googleApiKey}`
    );
    const data = await response.json();
    if (data && data.date) {
      const dateString = formatCaptureDate(data.date);
      setCaptureDate(dateString);
    } else {
      setCaptureDate('Unknown Date');
    }
  };

  const formatCaptureDate = (dateString: string) => {
    const [year, month] = dateString.split('-');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const monthName = months[parseInt(month) - 1];
    return `${monthName} ${year}`;
  };

  return (
    <>
      {!streetViewActive ? (
        <button
          style={{
            position: 'absolute',
            top: '80%',
            left: '2%',
            zIndex: 5,
            backgroundColor: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            boxShadow: '0px 2px 6px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onClick={openStreetView}
        >
          🛣️ Street View
        </button>
      ) : (
        <>
          {/* Top Left Info Card */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '450px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0px 2px 6px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              width: '320px',
              zIndex: 5,
            }}
          >
            <div style={{ padding: '12px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>
                {placeName}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                {captureDate} &nbsp;
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('See more dates clicked! 🚀');
                  }}
                  style={{ color: '#4285F4', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  See more dates
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Left Mini Map + Back Button */}
          {/* Bottom Left Mini Map + Back Button */}
<div
  style={{
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.3)',
    width: '200px',
    height: '150px',
    overflow: 'hidden',
    zIndex: 5,
    cursor: 'pointer',
    transform: streetViewActive ? 'scale(1)' : 'scale(0.7)',
    transition: 'transform 0.4s ease',
  }}
  onClick={() => {
    // Animate mini map shrinking first
    const miniMapElement = document.getElementById('mini-map-card');
    if (miniMapElement) {
      miniMapElement.style.transform = 'scale(0.7)';
    }

    setTimeout(() => {
      // After animation, close Street View
      closeStreetView();
    }, 400); // wait 0.4s for animation
  }}
  id="mini-map-card"
>
  <iframe
    title="mini-map"
    width="200"
    height="150"
    frameBorder="0"
    style={{ border: 0 }}
    src={`https://www.google.com/maps/embed/v1/view?key=${googleApiKey}&center=${map?.getCenter()?.lat()},${map?.getCenter()?.lng()}&zoom=18&maptype=roadmap`}
    allowFullScreen
  ></iframe>
  <div
    style={{
      position: 'absolute',
      bottom: '5px',
      left: '5px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      padding: '2px 6px',
      fontSize: '12px',
      borderRadius: '4px',
    }}
  >
    ⬅️ Back to Map
  </div>
</div>

        </>
      )}

      {/* Street View container */}
      <div
        id="street-view"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 4,
          display: streetViewActive ? 'block' : 'none',
        }}
      />
    </>
  );
};

export default StreetViewButton;