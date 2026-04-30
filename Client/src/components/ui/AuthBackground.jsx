import React from 'react';
import { motion } from 'framer-motion';

const AuthBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
      
      {/* ── Ambient Orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, -30, 0], y: [0, -60, 40, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-15%', left: '-10%',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.30) 0%, rgba(79,70,229,0.12) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ x: [0, -100, 50, 0], y: [0, 80, -40, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'absolute', bottom: '-20%', right: '-10%',
            width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(219,39,119,0.22) 0%, rgba(168,85,247,0.08) 50%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        <motion.div
          animate={{ x: [0, 120, -60, 0], y: [0, -80, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
          style={{
            position: 'absolute', top: '35%', left: '40%',
            width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,70,229,0.20) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Subtle grid */}
        <div
          style={{
            position: 'absolute', inset: 0, opacity: 0.025,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        {/* Subtle radial vignette */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(4,4,14,0.6) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;
