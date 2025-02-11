
const Navbar = ({ onHomeClick, onMessagesClick, onProfileClick, onAiClick, streakDays }) => {
  return (
    <div className="w-full flex justify-between items-center px-4 py-2 bg-darkGray border-b border-mediumGray sm:border-0 sm:rounded-lg sm:mt-4 sm:mx-4 sm:w-[calc(100%-2rem)]">
      <div className="flex items-center space-x-4">
        <button className="text-white text-xl" onClick={onHomeClick}>
          <img src="/house.png" alt="Home" className="w-6 h-6 invert" />
        </button>
        <button className="text-white text-xl" onClick={onMessagesClick}>
          <img src="/message.png" alt="Messages" className="w-6 h-6" />
        </button>
        {/* <button className="text-white text-xl" onClick={onAiClick}>
          <img src="/ai.png" alt="Messages" className="w-6 h-6" />
        </button> */}
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center text-white">
          <img src="/fire.png" alt="Streak" className="w-6 h-6" />
          <span className="ml-1 text-lg">{streakDays}</span>
        </div>
        <button className="text-white text-xl" onClick={onProfileClick}>
          <img src="/user.png" alt="User" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
