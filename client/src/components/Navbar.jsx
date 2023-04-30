import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="bg-white py-6 px-8 shadow-inner border-b-2 h-20">
      <div className="mx-auto flex justify-between">
        <div className="text-lg font-bold">OutageX</div>
        <div className="text-lg text-gray-500">Sign out</div>
      </div>
    </div>
  );
};

export default Navbar;
