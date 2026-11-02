import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useAudio } from '../../utils/useAudio';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';

export const MusicPlayerPill: React.FC = () => {
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
    <button
      className="music-toggle-pill"
      onClick={handleToggle}
      aria-label="Toggle Birthday Music"
      title={isPlaying ? (isMuted ? "Unmute Music" : "Mute Music") : "Play Birthday Music"}
    >
      <div className={`equalizer-bars ${!isPlaying || isMuted ? 'equalizer-paused' : ''}`}>
        <div className="eq-bar" />
        <div className="eq-bar" />
        <div className="eq-bar" />
        <div className="eq-bar" />
      </div>

      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap' }}>
        {isPlaying ? (isMuted ? 'Muted' : 'Music On') : 'Play Music'}
      </span>

      {isPlaying ? (
        isMuted ? (
          <VolumeX size={16} color="#94a3b8" />
        ) : (
          <Volume2 size={16} color="#ffd700" />
        )
      ) : (
        <Music size={16} color="#ffd700" />
      )}
    </button>
  );
};
