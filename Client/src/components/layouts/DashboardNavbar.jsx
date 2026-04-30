import React from 'react'
import ProfileInfoCard from '../Cards/ProfileInfoCard.jsx';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: 64,
      background: 'rgba(7, 7, 19, 0.75)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
    }}>
      <div className='container mx-auto h-full flex items-center justify-between px-4 md:px-6'>
        
        {/* Logo */}
        <Link to='/dashboard' style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(124,58,237,0.5)',
              fontSize: 14,
            }}>
              ✦
            </div>
            <span style={{
              fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Vṛttāntam
            </span>
          </div>
        </Link>

        <ProfileInfoCard />
      </div>
    </div>
  );
}

export default Navbar;