import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

function ProfileInfoCard() {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (confirmLogout) {
   localStorage.clear();
    clearUser();
    navigate('/');
  }
};


  return (
    user && (
      <div className='flex items-center'>
        <img src={user.profileImageUrl} alt="" className='w-11 h-11 bg-gray-300 rounded-full mr-3' />
        <div>
          <div className='text-[15px] font-bold leading-3'>{user.name || ""}</div>
          <button className='text-purple-500 text-sm font-semibold cursor-pointer hover:underline' onClick={handleLogout}>LogOut</button>
        </div>
      </div>
    )
  )
}

export default ProfileInfoCard