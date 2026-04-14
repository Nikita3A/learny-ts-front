import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [username, setUsername] = useState(currentUser?.user.username || '');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const response = await axios.put(`/api/users/${currentUser.user.id}`, {
        username,
        password,
      });
      if (response.status === 200) {
        alert('Profile updated successfully!');
        // Optionally, update the Redux state with new username
        dispatch(updateUsername(username));
        // dispatch({ type: 'UPDATE_USER', payload: { username } });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating profile.');
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/signin');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-dark">
      <div className="bg-darkGray border-0 sm:border-mediumGray sm:border-2 p-4 sm:p-8 sm:rounded-2xl shadow-md w-full h-full sm:h-auto sm:max-w-md flex flex-col justify-start sm:mt-6 sm:mb-6">
        <h2 className="text-white text-2xl font-bold mt-16 mb-8 text-center sm:mt-6 sm:mb-8">Profile</h2>
        <div className="flex flex-col items-center mb-8">
          <img src="/user.png" alt="User Profile" className="w-24 h-24 rounded-full mb-4" />
        </div>
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <input
              type="email"
              value={currentUser?.user.email || ''}
              readOnly
              className="w-full p-3 bg-dark text-white rounded-2xl focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Name"
              className="w-full p-3 bg-dark text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 bg-dark text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green"
            />
          </div>
          <div className="mb-6">
            <button
              onClick={handleSave}
              className="w-full p-3 bg-green text-white rounded-2xl hover:bg-green-dark focus:outline-none"
            >
              Save
            </button>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="w-full p-3 bg-red text-white rounded-2xl hover:bg-red-600 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
