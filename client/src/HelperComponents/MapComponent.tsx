import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export type EVLocation = {
  zip: number;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  state: string;
  street_address: string;

};
export const useEVLocations = () => {
  const [EVLocations, setEVLocations] = useState<EVLocation[]>([]);//call endpoint here
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return { EVLocations, isLoading, error };
};

interface MapComponentProps {
  latitude: number | undefined;
  longitude: number | undefined;
  zoom: number;
  setEVLocations: EVLocation[];
  //setZipcode: number | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude, zoom, setEVLocations }) => {
  const apiKey = process.env.REACT_APP_MAP_KEY;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const mapContainerStyle = {
    width: '100%',
    height: '80vh',
  };
  

  const center = useMemo(() => ({
    lat: latitude || 44.5,
    lng: longitude || -89.5,
  }), [latitude, longitude]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if(apiKey){
      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['places']
      });
      console.log("Map Comp:"+ setEVLocations);
  
      loader.load().then((google) => {
        const centerLoc = {
          lat: setEVLocations[0].latitude,
          lng:setEVLocations[0].longitude
        }
        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: new google.maps.LatLng(centerLoc.lat, centerLoc.lng),
            zoom: 12, // Use the zoom prop here
          });
          let id = 1;
          setEVLocations.forEach((evlocation) => {
            let contentString = '<h3>'+'EV Charger # '+id+'</h3>'+
          '<p>'+evlocation.street_address+ ', '+ evlocation.city+', '+evlocation.state+', '+evlocation.zip+'</p>' ;
            contentString+='<a target="_blank" href=https://www.google.com/maps?ll='+evlocation.latitude+','+evlocation.longitude+'>View on Google Maps</a>';
            const infowindow = new google.maps.InfoWindow({
              content: contentString,
              ariaLabel: "Location "+ id,
            });
          
            const marker = new google.maps.Marker({
              position: { lat: evlocation.latitude, lng: evlocation.longitude },
              title:'EV Charger # '+id,
              map,
            });
  
            marker.addListener('click', () => {
              infowindow.open({
                anchor: marker,
                map,
              });
            });
            id++;
          });
        } else {
          console.error('Could not find element with ref "mapRef"');
        }
      }).catch(e => {
        // handle error
      });
    }
  }, [setEVLocations, latitude, longitude, isMounted, apiKey, center, zoom]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <br></br>
          <div ref={mapRef} style={mapContainerStyle}>
            {/* Other components here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
