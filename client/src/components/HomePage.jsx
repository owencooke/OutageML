import Map from './Map';
import { useState, useEffect } from 'react';

const priorityColor = {
  // Low Outage - Green
  1: 'bg-[#34a853]',
  // Medium Outage - YelLow Outage
  2: 'bg-[#ebbd34]',
  // High Outage - Orange
  3: 'bg-[#eb8334]',
  // Urgent Outage! - red circle
  4: 'bg-[#ff0000]',
};
const Home = () => {
  const [windowHeight, setWindowHeight] = useState(0);
  const [transformers, setTransformers] = useState([]);
  const [center, setCenter] = useState([53.5244, -113.4909]);
  const [zoom, setZoom] = useState(11);
  const [init, setInit] = useState(false);

  useEffect(() => {
    setTransformers([
      {
        coordinates: [53.5461, -113.4938],
        priorityRanking: 2,
        timeElapsed: 15,
        information: {
          message: 'Medium Outage',
        },
      },
      {
        coordinates: [53.5232, -113.5263],
        priorityRanking: 4,
        timeElapsed: 25,
        information: {
          message: 'Urgent Outage!',
        },
      },
      {
        coordinates: [53.5763, -113.5765],
        priorityRanking: 1,
        timeElapsed: 10,
        information: {
          message: 'Low Outage',
        },
      },
      {
        coordinates: [53.5333, -113.5765],
        priorityRanking: 3,
        timeElapsed: 20,
        information: {
          message: 'High Outage',
        },
      },
      {
        coordinates: [53.5512, -113.4836],
        priorityRanking: 1,
        timeElapsed: 5,
        information: {
          message: 'Low Outage',
        },
      },
      {
        coordinates: [53.5304, -113.5057],
        priorityRanking: 2,
        timeElapsed: 10,
        information: {
          message: 'Medium Outage',
        },
      },
      {
        coordinates: [53.5677, -113.5576],
        priorityRanking: 3,
        timeElapsed: 15,
        information: {
          message: 'High Outage',
        },
      },
      {
        coordinates: [53.5415, -113.6012],
        priorityRanking: 4,
        timeElapsed: 20,
        information: {
          message: 'Urgent Outage!',
        },
      },
    ]);

    setWindowHeight(window.innerHeight);
    function handleResize() {
      setWindowHeight(window.innerHeight);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navbarHeight = 80; // Set your navbar height here
  const bodyHeight = windowHeight - navbarHeight;

  return (
    <div className="flex flex-row w-screen">
      {/* Priority List */}
      <div
        style={{ height: bodyHeight }}
        className="w-2/5 p-8 flex flex-col gap-6 overflow-auto no-scrollbar"
      >
        {transformers
          .sort((a, b) => b.priorityRanking - a.priorityRanking)
          .map((transformer, i) => {
            return (
              <div
                key={i}
                className="w-full h-40 rounded-xl flex border-[1px] border-black p-6"
                onClick={() => {
                  setCenter(transformer.coordinates);
                  setZoom(15);
                  setInit(true);
                }}
              >
                <div
                  className={`${
                    priorityColor[transformer.priorityRanking]
                  } mt-1 mr-3 h-4 w-4 rounded-full`}
                ></div>
                <div className="w-full flex flex-col gap-2">
                  <div className="w-5/6 font-medium text-xl">
                    {transformer.information.message}
                  </div>
                  <div className="w-5/6 text-gray-500">
                    {transformer.coordinates[0]}
                    {', '}
                    {transformer.coordinates[0]}
                  </div>
                  <div className="w-5/6 text-gray-500">
                    Outage elapsed: {transformer.timeElapsed} hours
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Map component */}
      <div className="w-3/5 border-l-[1px] border-black">
        <Map
          zoom={zoom}
          center={center}
          transformers={transformers}
          init={init}
        />
      </div>
    </div>
  );
};

export default Home;
