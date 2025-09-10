import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const SharedLayout = () => (
  <div className="flex flex-col h-screen">
    <Navbar streakDays={1} />
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
);

export default SharedLayout;