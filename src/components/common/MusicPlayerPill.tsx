import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useAudio } from '../../utils/useAudio';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';

interface MusicPlayerPillProps {
  onOpenCli?: () => void;
}

export const MusicPlayerPill: React.FC<MusicPlayerPillProps> = () => {
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
      <button
        onClick={handleToggle}
        className="btn-cyber-secondary"
        style={{
          padding: '6px 14px',
          fontSize: '0.78rem',
          borderColor: isPlaying ? '#ff2a4b' : 'rgba(255, 42, 75, 0.4)',
          color: isPlaying ? '#fff' : '#cbd5e1',
          background: 'rgba(5, 5, 8, 0.85)',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Toggle Audio"
      >
        <span>{isPlaying ? (isMuted ? 'AUDIO: MUTED' : 'AUDIO: PLAYING') : 'AUDIO: OFF'}</span>

        {isPlaying ? (
          isMuted ? (
            <VolumeX size={14} color="#ff2a4b" />
          ) : (
            <Volume2 size={14} color="#ffb703" />
          )
        ) : (
          <Music size={14} color="#ff2a4b" />
        )}
      </button>
    </div>
  );
};
