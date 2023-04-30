import { Link } from 'react-router-dom';
import { IoPower } from 'react-icons/io5';

const Navbar = () => {
  return (
    <div className="bg-white py-6 px-8 shadow-inner border-b-[1px] border-black h-20">
      <div className="mx-auto flex justify-between">
        <div className="font-bold text-xl flex items-start">
          <IoPower className="text-3xl pb-[2px]" />
          utageML
        </div>
        <div className="text-xl text-gray-500">Sign out</div>
      </div>
    </div>
  );
};

export default Navbar;
