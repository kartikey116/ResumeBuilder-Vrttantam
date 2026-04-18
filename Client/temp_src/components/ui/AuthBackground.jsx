import React from 'react';
import { motion } from 'framer-motion';

const AuthBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0c]">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Primary Orb */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"
        />

        {/* Secondary Orb */}
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 120, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[130px]"
        />

        {/* Accent Orb */}
        <motion.div
          animate={{
            x: [0, 150, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-[100px]"
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full flex items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;
