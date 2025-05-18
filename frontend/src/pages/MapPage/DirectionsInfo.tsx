import React from 'react';

interface DirectionsInfoProps {
  route: google.maps.DirectionsRoute;
}

const DirectionsInfo: React.FC<DirectionsInfoProps> = ({ route }) => {
  const leg = route.legs[0];

  return (
    <div
      style={{
        position: 'absolute',
        top: '35% ',
        left: '1rem',
        width: '24rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '1rem',
        overflowY: 'auto',
        maxHeight: '80vh',
        zIndex: 50,
        fontFamily: 'Arial, sans-serif',
        height: '300px',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Route Information
      </h2>

      <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
        <p>
          <span style={{ fontWeight: 600 }}>From:</span> {leg.start_address}
        </p>
        <p>
          <span style={{ fontWeight: 600 }}>To:</span> {leg.end_address}
        </p>
        <p>
          <span style={{ fontWeight: 600 }}>Distance:</span> {leg.distance?.text}
        </p>
        <p>
          <span style={{ fontWeight: 600 }}>Duration:</span> {leg.duration?.text}
        </p>
      </div>

      <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Steps:</h3>
      <ol
        style={{
          listStyleType: 'decimal',
          paddingLeft: '1.25rem',
          fontSize: '0.875rem',
          color: '#374151', // Tailwind gray-700
        }}
      >
        {leg.steps.map((step, index) => (
          <li
            key={index}
            dangerouslySetInnerHTML={{ __html: step.instructions }}
            style={{ marginBottom: '0.25rem' }}
          />
        ))}
      </ol>
    </div>
  );
};

export default DirectionsInfo;  