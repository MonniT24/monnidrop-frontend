import React,{
  useEffect,
  useState
} from "react";

import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader
} from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyle = {
  width:"100%",
  height:"360px",
  borderRadius:"22px"
};

const accraCenter = {
  lat:5.6037,
  lng:-0.1870
};

const ghanaBounds = {
  north:11.2,
  south:4.5,
  west:-3.5,
  east:1.4
};

function GoogleLiveMap({
  pickupCoords,
  dropoffCoords,
  mode = "pickup"
}){

  const [currentLocation,setCurrentLocation] =
    useState(accraCenter);

  const [directions,setDirections] =
    useState(null);

  const { isLoaded, loadError } =
    useJsApiLoader({
      googleMapsApiKey:
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries
    });

  useEffect(()=>{

    if(!navigator.geolocation){
      return;
    }

    const watchId =
      navigator.geolocation.watchPosition(
        (position)=>{

          setCurrentLocation({
            lat:position.coords.latitude,
            lng:position.coords.longitude
          });
        },
        (error)=>{

          console.log(
            "RIDER MAP LOCATION ERROR:",
            error.message
          );
        },
        {
          enableHighAccuracy:true,
          timeout:10000,
          maximumAge:0
        }
      );

    return ()=>{

      navigator.geolocation.clearWatch(
        watchId
      );
    };

  },[]);

  useEffect(()=>{

    if(
      !isLoaded ||
      !window.google
    ){
      setDirections(null);
      return;
    }

    let origin = null;
    let destination = null;

    if(mode === "pickup"){

      origin =
        currentLocation;

      destination =
        pickupCoords;
    }

   if(mode === "dropoff"){

  origin =
    currentLocation;

  destination =
    dropoffCoords;
}

    if(
      !origin ||
      !destination
    ){
      setDirections(null);
      return;
    }

    const directionsService =
      new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode:
          window.google.maps.TravelMode.DRIVING
      },
      (result,status)=>{

        if(status === "OK"){

          setDirections(result);

        }else{

          console.log(
            "MAP ROUTE ERROR:",
            status
          );

          setDirections(null);
        }
      }
    );

  },[
    isLoaded,
    pickupCoords,
    dropoffCoords,
    currentLocation,
    mode
  ]);

  if(loadError){
    return (
      <div>
        Google Map failed to load.
      </div>
    );
  }

  if(!isLoaded){
    return (
      <div>
        Loading Google Map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={
        currentLocation ||
        pickupCoords ||
        accraCenter
      }
      zoom={13}
      options={{
        restriction:{
          latLngBounds:ghanaBounds,
          strictBounds:true
        },
        streetViewControl:false,
        mapTypeControl:false,
        fullscreenControl:true
      }}
    >

      <Marker
        position={currentLocation}
        label="You"
      />

      {
        pickupCoords && (
          <Marker
            position={pickupCoords}
            label="P"
          />
        )
      }

      {
        dropoffCoords && (
          <Marker
            position={dropoffCoords}
            label="D"
          />
        )
      }

      {
        directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers:true,
              polylineOptions:{
                strokeColor:"#1d4ed8",
                strokeOpacity:0.9,
                strokeWeight:5
              }
            }}
          />
        )
      }

    </GoogleMap>
  );
}

export default GoogleLiveMap;