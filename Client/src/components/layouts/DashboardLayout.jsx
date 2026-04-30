import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './DashboardNavbar.jsx';

function DashboardLayout({ activeMenu, children }) {
  const { user } = useContext(UserContext);
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      backgroundImage: `
        radial-gradient(ellipse 80% 40% at 50% -5%, rgba(124,58,237,0.18) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 90% 100%, rgba(219,39,119,0.10) 0%, transparent 60%)
      `,
    }}>
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className='container mx-auto pt-6 pb-10 px-4 md:px-6'>
          {children}
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;