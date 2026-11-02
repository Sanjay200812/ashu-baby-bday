import React from 'react';
import { Play, Pause, Volume2, VolumeX, Disc3, Music2 } from 'lucide-react';
import { useAudio } from '../../utils/useAudio';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';

export const AudioPlayer: React.FC = () => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isUsingSynth,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
  } = useAudio();

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="glass-panel"
      style={{
        width: '100%',
        maxWidth: '520px',
        padding: '24px 28px',
        border: '1px solid rgba(255, 215, 0, 0.4)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Vinyl record spinning badge / Song Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2a1645 0%, #151025 100%)',
            border: '2px solid rgba(255, 215, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isPlaying ? '0 0 20px rgba(255, 215, 0, 0.4)' : 'none',
            animation: isPlaying ? 'spin 6s linear infinite' : 'none',
            flexShrink: 0,
          }}
        >
          {isPlaying ? (
            <Disc3 size={28} color="#ffd700" />
          ) : (
            <Music2 size={24} color="#94a3b8" />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {BIRTHDAY_CONFIG.songTitle}
          </div>
          <div
            style={{
              fontSize: '0.82rem',
              color: '#ffd700',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {BIRTHDAY_CONFIG.songArtist}
          </div>
        </div>

        {/* Dancing Visualizer Bars */}
        <div className={`equalizer-bars ${!isPlaying ? 'equalizer-paused' : ''}`}>
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
        </div>
      </div>

      {/* Progress Bar & Time */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: '100%', height: '8px', marginBottom: '8px' }}>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeekChange}
            style={{
              width: '100%',
              height: '8px',
              background: `linear-gradient(to right, #ffd700 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`,
              borderRadius: '9999px',
              position: 'relative',
              zIndex: 2,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#94a3b8',
            fontFamily: 'monospace',
          }}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Bottom Controls: Play/Pause, Volume */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        {/* Play/Pause Button */}
        <button
          onClick={() => togglePlay(BIRTHDAY_CONFIG.birthdaySongUrl)}
          className="btn-primary-glow"
          style={{
            padding: '10px 22px',
            fontSize: '0.95rem',
            borderRadius: '9999px',
          }}
        >
          {isPlaying ? (
            <>
              <Pause size={18} fill="#120d02" />
              <span>PAUSE SONG</span>
            </>
          ) : (
            <>
              <Play size={18} fill="#120d02" />
              <span>PLAY SONG</span>
            </>
          )}
        </button>

        {/* Volume Slider & Mute */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleMute}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isMuted ? '#ef4444' : '#ffd700',
              display: 'flex',
              alignItems: 'center',
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={{ width: '80px', height: '5px' }}
          />
        </div>
      </div>

      {/* Synth / Track mode hint */}
      {isUsingSynth && (
        <div
          style={{
            marginTop: '14px',
            fontSize: '0.75rem',
            color: '#64748b',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          Playing melodic music-box chimes. (Replace with custom MP3 in <code>public/audio/</code> anytime!)
        </div>
      )}
    </div>
  );
};

