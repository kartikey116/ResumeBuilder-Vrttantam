import React from 'react'
import { useState, useEffect } from 'react';
import { getLightColorFromImage } from '../../utils/helper.js';
import { FiCheckCircle, FiShare2, FiTarget } from 'react-icons/fi';

function ResumeSummaryCard({ imgUrl, title, lastUpdated, onSelect, atsScore, onAtsCheck, onPublish }) {

  const getScoreColor = (score) => {
    if (score >= 75) return { text: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', glow: 'rgba(74,222,128,0.20)' };
    if (score >= 50) return { text: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', glow: 'rgba(251,191,36,0.18)' };
    return { text: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)', glow: 'rgba(248,113,113,0.18)' };
  };

  const scoreColors = atsScore ? getScoreColor(atsScore) : null;

  return (
    <div
      onClick={onSelect}
      style={{
        height: 300,
        display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(124,58,237,0.15)';
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.30)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
      }}
    >
      {/* Thumbnail area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
        {/* ATS Score Badge */}
        {atsScore > 0 && (
          <div style={{
            position: 'absolute', top: 10, right: 10, zIndex: 10,
            display: 'flex', alignItems: 'center', gap: 5,
            background: scoreColors.bg,
            border: `1px solid ${scoreColors.border}`,
            borderRadius: 20,
            padding: '4px 10px',
            boxShadow: `0 0 12px ${scoreColors.glow}`,
            backdropFilter: 'blur(10px)',
          }}>
            <FiCheckCircle size={11} color={scoreColors.text} />
            <span style={{ fontSize: 11, fontWeight: 800, color: scoreColors.text }}>
              {atsScore}%
            </span>
          </div>
        )}

        {imgUrl ? (
          <img
            src={imgUrl} alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.15))',
              border: '1px solid rgba(124,58,237,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>
              📄
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>No preview</span>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div style={{
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.25)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(10px)',
      }}>
        <h5 style={{
          fontSize: 13, fontWeight: 700,
          color: 'rgba(255,255,255,0.90)',
          margin: '0 0 6px 0',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {title}
        </h5>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {lastUpdated}
          </p>
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
            <button
              onClick={e => { e.stopPropagation(); onAtsCheck && onAtsCheck(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 9px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.30)',
                color: '#818cf8', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(99,102,241,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <FiTarget size={9} /> ATS
            </button>
            {onPublish && (
              <button
                onClick={e => { e.stopPropagation(); onPublish(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 9px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.30)',
                  color: '#a78bfa', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.25)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(124,58,237,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <FiShare2 size={9} /> Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeSummaryCard;