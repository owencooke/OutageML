import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';

const priorityCircle = {
  // Low - Green
  1: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%2334a853" stroke="white" stroke-width="15"/></svg>',
  // Medium - Yellow
  2: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%234285f4" stroke="white" stroke-width="15"/></svg>',
  // High - Orange
  3: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%23fbbc05" stroke="white" stroke-width="15"/></svg>',
  // Urgent - red circle
  4: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%23ff0000" stroke="white" stroke-width="15"/></svg>',
};

const Map = ({ transformers }) => {
  const edmontonCenter = [53.5444, -113.4909];

  return (
    <MapContainer
      center={edmontonCenter}
      zoom={11}
      zoomControl={false}
      className="h-screen"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup>
        {transformers.map((transformer, i) => {
          const priority = new Icon({
            iconUrl: priorityCircle[transformer.priorityRanking],
            iconSize: [30, 30],
          });

          return (
            <Marker key={i} position={transformer.coordinates} icon={priority}>
              <Popup>{transformer.information.message}</Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
