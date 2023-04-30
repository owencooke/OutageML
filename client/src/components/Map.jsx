import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

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

const Map = () => {
  const transformers = [
    {
      coordinates: [53.5461, -113.4938],
      priorityRanking: 2,
      timeElapsed: 15,
      information: {
        message: 'Medium',
      },
    },
    {
      coordinates: [53.5232, -113.5263],
      priorityRanking: 4,
      timeElapsed: 25,
      information: {
        message: 'Urgent',
      },
    },
    {
      coordinates: [53.5763, -113.5765],
      priorityRanking: 1,
      timeElapsed: 10,
      information: {
        message: 'Low',
      },
    },
    {
      coordinates: [53.5333, -113.5765],
      priorityRanking: 3,
      timeElapsed: 20,
      information: {
        message: 'High',
      },
    },
    {
      coordinates: [53.5512, -113.4836],
      priorityRanking: 1,
      timeElapsed: 5,
      information: {
        message: 'Low',
      },
    },
    {
      coordinates: [53.5304, -113.5057],
      priorityRanking: 2,
      timeElapsed: 10,
      information: {
        message: 'Medium',
      },
    },
    {
      coordinates: [53.5677, -113.5576],
      priorityRanking: 3,
      timeElapsed: 15,
      information: {
        message: 'High',
      },
    },
    {
      coordinates: [53.5415, -113.6012],
      priorityRanking: 4,
      timeElapsed: 20,
      information: {
        message: 'Urgent',
      },
    },
  ];

  const edmontonCenter = [53.5444, -113.4909];

  return (
    <MapContainer
      center={edmontonCenter}
      zoom={11}
      zoomControl={false}
      className="h-screen"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
    </MapContainer>
  );
};

export default Map;
