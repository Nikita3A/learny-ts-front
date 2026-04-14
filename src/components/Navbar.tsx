// Navbar.tsx
import { useNavigate } from 'react-router-dom';

const Navbar = ({ streakDays }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-between items-center px-4 py-2 bg-darkGray border-b border-mediumGray sm:border-0 sm:rounded-lg">
      <div className="flex items-center space-x-4">
        <button className="text-white text-xl" onClick={() => navigate('/courses')}>
          <img src="/house.png" alt="Home" className="w-6 h-6 invert" />
        </button>
        <button className="text-white text-xl" onClick={() => navigate('/chats')}>
          <img src="/message.png" alt="Messages" className="w-6 h-6" />
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center text-white">
          <img src="/fire.png" alt="Streak" className="w-6 h-6" />
          <span className="ml-1 text-lg">{streakDays}</span>
        </div>
        <button className="text-white text-xl" onClick={() => navigate('/profile')}>
          <img src="/user.png" alt="User" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
