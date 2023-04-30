import Map from './Map';
import { useState, useEffect } from 'react';

const priorityColor = {
  // Low - Green
  1: 'bg-[#34a853]',
  // Medium - Yellow
  2: 'bg-[#4285f4]',
  // High - Orange
  3: 'bg-[#fbbc05]',
  // Urgent - red circle
  4: 'bg-[#ff0000]',
};
const Home = () => {
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
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
  console.log(bodyHeight);
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
  return (
    <div className="flex flex-row w-screen">
      {/* Priority List */}
      <div
        style={{ height: bodyHeight }}
        className="w-2/5 p-8 flex flex-col gap-6 overflow-auto"
      >
        {transformers
          .sort((a, b) => b.priorityRanking - a.priorityRanking)
          .map((transformer, i) => {
            return (
              <div key={i} className="w-full h-40 rounded-xl flex border-2 p-4">
                <div
                  className={`${
                    priorityColor[transformer.priorityRanking]
                  } mt-1 mx-3 h-4 w-4 rounded-full`}
                ></div>
                <div className="w-full">
                  <div className="w-5/6 font-bold">
                    St. Albert, Alberta • Heritage Drive
                  </div>
                  <div className="w-5/6 text-gray-500">
                    {transformer.coordinates[0]}
                    {', '}
                    {transformer.coordinates[1]}
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
      <div className="w-3/5 border-l-2">
        <Map transformers={transformers} />
      </div>
    </div>
  );
};

export default Home;
