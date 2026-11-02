import React from 'react';
import { Activity, X, Database, ShieldCheck, Trophy, Key, CheckCircle2, Lock } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { GameProgress } from '../../types/game';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: GameProgress;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose, progress }) => {
  if (!isOpen) return null;

  const totalGames = 6;
  const completedGames = [
    progress.flapCompleted,
    progress.gtaCompleted,
    progress.spidermanCompleted,
    progress.freefireCompleted,
    progress.foodCompleted,
    progress.sleepCompleted,
  ].filter(Boolean).length;

  const totalQuizzes = 3;
  const completedQuizzes = [
    progress.gamingQuizCompleted,
    progress.personalQuizCompleted,
    progress.movieQuizCompleted,
  ].filter(Boolean).length;

  const fragments = BIRTHDAY_CONFIG.dataFragments;
  const collectedCount = Array.isArray(progress?.fragmentsCollected)
    ? progress.fragmentsCollected.length
    : 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(2, 4, 8, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        fontFamily: 'var(--font-mono)',
      }}
      onClick={onClose}
    >
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #00e5ff',
          boxShadow: '0 0 45px rgba(0, 229, 255, 0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="terminal-header-bar" style={{ background: 'rgba(0, 229, 255, 0.08)', color: '#00e5ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#00e5ff" />
            <span>SOUTH_DEV // SYSTEM_TELEMETRY_DASHBOARD</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#ff3344', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Top Status Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(0, 255, 102, 0.06)',
                border: '1px solid rgba(0, 255, 102, 0.25)',
                borderRadius: '6px',
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#5c7866', marginBottom: '4px' }}>PROTOCOL STATUS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00ff66' }}>ACTIVE // INTRUDED</div>
            </div>

            <div
              style={{
                background: 'rgba(0, 229, 255, 0.06)',
                border: '1px solid rgba(0, 229, 255, 0.25)',
                borderRadius: '6px',
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#5c7866', marginBottom: '4px' }}>MODULES CLEARED</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00e5ff' }}>
                {completedGames} / {totalGames} UNITS
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 215, 0, 0.06)',
                border: '1px solid rgba(255, 215, 0, 0.25)',
                borderRadius: '6px',
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#5c7866', marginBottom: '4px' }}>QUIZ DATABASE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffd700' }}>
                {completedQuizzes} / {totalQuizzes} SOLVED
              </div>
            </div>
          </div>

          {/* Section: Secret Data Fragments */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#00ff66', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={16} />
                <span>SECRET DATA FRAGMENTS ({collectedCount} / {fragments.length} DECRYPTED)</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {fragments.map((frag) => {
                const isFound =
                  Array.isArray(progress?.fragmentsCollected) &&
                  progress.fragmentsCollected.includes(frag.id);
                return (
                  <div
                    key={frag.id}
                    style={{
                      background: isFound ? 'rgba(0, 255, 102, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      border: isFound ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          color: isFound ? '#00ff66' : '#94a3b8',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {frag.title} [{frag.sourceGame}]
                      </div>
                      <div style={{ fontSize: '0.86rem', color: isFound ? '#e2fce8' : '#64748b', marginTop: '2px' }}>
                        {isFound ? frag.decryptedMessage : `[LOCKED: ${frag.encryptedCode}]`}
                      </div>
                    </div>
                    {isFound ? <CheckCircle2 size={18} color="#00ff66" /> : <Lock size={16} color="#64748b" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allied Signatures */}
          <div
            style={{
              padding: '14px',
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.35)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#ff3344' }}>
              ORIGINATING SYNDICATE ARCHITECTS:
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffd700' }}>
              AAKASH & SANJAY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

