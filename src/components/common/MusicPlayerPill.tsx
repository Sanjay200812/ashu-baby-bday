import React from 'react';
import { Volume2, VolumeX, Music, Terminal } from 'lucide-react';
import { useAudio } from '../../utils/useAudio';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';

interface MusicPlayerPillProps {
  onOpenCli?: () => void;
}

export const MusicPlayerPill: React.FC<MusicPlayerPillProps> = ({ onOpenCli }) => {
  const { isPlaying, isMuted, togglePlay, toggleMute } = useAudio();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying) {
      togglePlay(BIRTHDAY_CONFIG.birthdaySongUrl);
    } else {
      toggleMute();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 100,
        display: 'flex',
        gap: '8px',
      }}
    >
      {onOpenCli && (
        <button
          onClick={onOpenCli}
          className="btn-cyber-secondary"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          title="Open Hidden Command Terminal"
        >
          <Terminal size={14} color="#00ff66" />
          <span>[ CLI ]</span>
        </button>
      )}

      <button
        onClick={handleToggle}
        className="btn-cyber-secondary"
        style={{
          padding: '6px 14px',
          fontSize: '0.78rem',
          borderColor: isPlaying ? '#00ff66' : 'rgba(255,255,255,0.2)',
          color: isPlaying ? '#00ff66' : '#cbd5e1',
        }}
        aria-label="Toggle Audio"
      >
        <div className={`equalizer-bars ${!isPlaying || isMuted ? 'equalizer-paused' : ''}`}>
          <div className="eq-bar" style={{ background: '#00ff66' }} />
          <div className="eq-bar" style={{ background: '#00e5ff' }} />
          <div className="eq-bar" style={{ background: '#00ff66' }} />
        </div>

        <span>{isPlaying ? (isMuted ? 'AUDIO:MUTED' : 'AUDIO:ON') : 'AUDIO:OFF'}</span>

        {isPlaying ? (
          isMuted ? (
            <VolumeX size={14} color="#ff3344" />
          ) : (
            <Volume2 size={14} color="#00ff66" />
          )
        ) : (
          <Music size={14} />
        )}
      </button>
    </div>
  );
};
