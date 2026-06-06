import React from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "360px",
  borderRadius: "22px"
};

const accraCenter = {
  lat: 5.6037,
  lng: -0.1870
};

function GoogleLiveMap(){
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  if(loadError){
    return <div>Google Map failed to load.</div>;
  }

  if(!isLoaded){
    return <div>Loading Google Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={accraCenter}
      zoom={12}
    >
      <Marker position={accraCenter} />
    </GoogleMap>
  );
}

export default GoogleLiveMap;