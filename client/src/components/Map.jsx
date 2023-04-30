import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon, point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';

const priorityCircle = {
  // Low - Green
  1: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%2334a853" stroke="white" stroke-width="15"/></svg>',
  // Medium - Yellow
  2: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%23ebbd34" stroke="white" stroke-width="15"/></svg>',
  // High - Orange
  3: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><circle cx="50" cy="50" r="50" fill="%23eb8334" stroke="white" stroke-width="15"/></svg>',
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

function UpdateMapCentre(props) {
  // when the page refreshes, we don't want this to run
  if (props.init) {
    console.log(props.center, props.zoom);
    const map = useMap();
    map.panTo(props.center);
    map.zoomIn(props.zoom);
  }
  return null;
}

const Map = ({ center, transformers, zoom, init, priorityMap }) => {
  console.log('rendering map', center, zoom);
  return (
    <MapContainer center={center} zoom={11} className="h-screen" minZoom={11}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}
      >
        {transformers
          .filter((transformer) => !transformer.resolved)
          .map((transformer, i) => {
            const priority = new Icon({
              iconUrl: priorityCircle[transformer.priorityRanking],
              iconSize: [30, 30],
            });

            return (
              <Marker
                key={i}
                position={transformer.coordinates}
                icon={priority}
              >
                <Popup className="bg-white shadow-xl border-black border-[1px] rounded-xl p-4 h-96 w-96 text-lg">
                  <div
                    className={`${
                      priorityMap[transformer.priorityRanking][0]
                    } w-full py-6 mb-3 rounded-lg text-center text-white font-bold`}
                  >
                    <div>{priorityMap[transformer.priorityRanking][1]}</div>
                  </div>
                  <div className="py-3 text-left text-base text-gray-500">
                    <div>
                      Outage Location: {transformer.coordinates[0]}{' '}
                      {transformer.coordinates[1]}
                    </div>
                    <div>Time elapsed: {transformer.timeElapsed} hours</div>
                  </div>
                  <div className="border-t-[1px] border-black py-3 text-left text-base text-black">
                    <li>
                      This transformer recieved a priority score of{' '}
                      {transformer.priorityRanking}{' '}
                    </li>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MarkerClusterGroup>
      <UpdateMapCentre center={center} zoom={zoom} init={init} />
    </MapContainer>
  );
};

export default Map;
