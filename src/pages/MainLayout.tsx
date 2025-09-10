import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ChatsPage from './ChatsPage';
import CoursesPage from './CoursesPage';
import ProfilePage from './ProfilePage';
import AIChatPage from './AIChatPage';

const MainLayout = () => {
  const [currentView, setCurrentView] = useState('courses');

  return (
    <div className="flex flex-col h-screen bg-dark overflow-hidden">
      <Navbar
        onHomeClick={() => setCurrentView('courses')}
        onMessagesClick={() => setCurrentView('chats')}
        onAiClick={() => setCurrentView('ai')}
        onProfileClick={() => setCurrentView('profile')}
      />
      <div className="flex flex-grow h-full w-full overflow-hidden">
        {currentView === 'chats' && <ChatsPage />}
        {currentView === 'courses' && <CoursesPage />}
        {currentView === 'profile' && <ProfilePage />}
        {currentView === 'ai' && <AIChatPage />}
      </div>
    </div>
  );
};

export default MainLayout;