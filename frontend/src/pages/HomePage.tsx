import Map from './MapPage/MapPage';

const HomePage = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-4">Welcome to Local Events Finder</h1>
      <p className="text-gray-600 mb-4">Find events happening near you!</p>

      {/* Map-ийг энд харуулна */}
      <div className="w-full flex-1">
        {/* <LiveEventMap /> */}
        <Map />
      </div>
    </div>
  );
};

export default HomePage;
