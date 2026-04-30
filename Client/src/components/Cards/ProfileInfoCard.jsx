import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

function ProfileInfoCard() {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.clear();
      clearUser();
      navigate('/');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  return (
    user && (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 40,
        padding: '5px 14px 5px 6px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        {/* Avatar with glow ring */}
        <div style={{ position: 'relative', width: 34, height: 34 }}>
          <div style={{
            position: 'absolute', inset: -2,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            zIndex: 0,
          }} />
          
          {user.profileImageUrl && !imgError ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              onError={() => setImgError(true)}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                objectFit: 'cover', position: 'relative', zIndex: 1,
                border: '2px solid rgba(12,12,28,0.9)',
                background: '#1a1a24'
              }}
            />
          ) : (
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              position: 'relative', zIndex: 1,
              border: '2px solid rgba(12,12,28,0.9)',
              background: '#1a1a24',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 700,
              fontFamily: 'var(--sans)'
            }}>
              {getInitials(user.name)}
            </div>
          )}
        </div>

        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.90)' }}>
            {user.name || ''}
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontSize: 11, fontWeight: 600,
              color: 'transparent',
              backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Log out
          </button>
        </div>
      </div>
    )
  );
}

export default ProfileInfoCard;