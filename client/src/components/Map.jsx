import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, divIcon, point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';

const priorityCircle = {
  // Low - Green
  1: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%2334a853" stroke="white" stroke-width="15"/></svg>',
  // Medium - Yellow
  2: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%234285f4" stroke="white" stroke-width="15"/></svg>',
  // High - Orange
  3: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%23fbbc05" stroke="white" stroke-width="15"/></svg>',
  // Urgent Outage! - red circle
  4: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%23ff0000" stroke="white" stroke-width="15"/></svg>',
};

const createCustomClusterIcon = (cluster) => {
  return new divIcon({
    html: `<div class="bg-fuchsia-500 border-4 border-fuchsia-300 text-white h-10 w-10 rounded-full flex items-center justify-center">${cluster.getChildCount()}</div>`,
    className: 'custom-marker-cluster',
    iconSize: point(33, 33, true),
  });
};

const Map = ({ transformers }) => {
  const edmontonCenter = [53.5244, -113.4909];

  return (
    <MapContainer
      center={edmontonCenter}
      zoom={11}
      zoomControl={false}
      className="h-screen"
      minZoom={11}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}
      >
        {transformers.map((transformer, i) => {
          const priority = new Icon({
            iconUrl: priorityCircle[transformer.priorityRanking],
            iconSize: [30, 30],
          });

          return (
            <Marker key={i} position={transformer.coordinates} icon={priority}>
              <Popup className="bg-white shadow-xl rounded-xl p-4 h-96 w-96 text-lg">
                {transformer.information.message}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
