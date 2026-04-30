import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Modal({
  children,
  isOpen,
  onClose,
  hideHeader,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick,
  title
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: 16,
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(4,4,14,0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', zIndex: 1,
              display: 'flex', flexDirection: 'column',
              background: 'rgba(13,13,32,0.92)',
              backdropFilter: 'blur(30px) saturate(200%)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 24,
              boxShadow: '0 0 0 1px rgba(124,58,237,0.15), 0 40px 100px rgba(0,0,0,0.6)',
              maxHeight: '90vh',
              overflow: 'hidden',
              minWidth: 320,
            }}
          >
            {/* Header */}
            {!hideHeader && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '18px 22px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.90)', margin: 0 }}>
                  {title}
                </h3>
                {showActionBtn && (
                  <button className='btn-small-light mr-10' onClick={() => onActionClick()}>
                    {actionBtnIcon}
                    {actionBtnText}
                  </button>
                )}
              </div>
            )}

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                position: 'absolute', top: 14, right: 14,
                width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 8, cursor: 'pointer',
                color: 'rgba(255,255,255,0.50)',
                transition: 'all 0.2s',
                zIndex: 2,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;