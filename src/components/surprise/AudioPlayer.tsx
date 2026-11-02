import React from 'react';
import { Play, Pause, Volume2, VolumeX, Disc3, Music2, Cpu } from 'lucide-react';
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
      className="terminal-panel"
      style={{
        width: '100%',
        maxWidth: '540px',
        padding: '20px 24px',
        border: '1px solid rgba(0, 255, 102, 0.4)',
        boxShadow: '0 0 30px rgba(0, 255, 102, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Audio Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '4px',
            background: 'rgba(0, 255, 102, 0.1)',
            border: '1px solid #00ff66',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00ff66',
            boxShadow: isPlaying ? '0 0 16px rgba(0, 255, 102, 0.5)' : 'none',
            flexShrink: 0,
          }}
        >
          {isPlaying ? <Disc3 size={24} style={{ animation: 'spin 4s linear infinite' }} /> : <Music2 size={22} />}
        </div>

        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div
            style={{
              fontSize: '0.94rem',
              fontWeight: 800,
              color: '#e2fce8',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {BIRTHDAY_CONFIG.songTitle}
          </div>
          <div
            style={{
              fontSize: '0.78rem',
              color: '#00ff66',
              fontWeight: 600,
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
          <div className="eq-bar" style={{ background: '#00ff66' }} />
          <div className="eq-bar" style={{ background: '#00e5ff' }} />
          <div className="eq-bar" style={{ background: '#00ff66' }} />
          <div className="eq-bar" style={{ background: '#00e5ff' }} />
        </div>
      </div>

      {/* Scrub Range */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: '100%', height: '6px', marginBottom: '6px' }}>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeekChange}
            style={{
              width: '100%',
              height: '6px',
              background: `linear-gradient(to right, #00ff66 ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%)`,
              borderRadius: '2px',
              position: 'relative',
              zIndex: 2,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#5c7866',
            fontFamily: 'monospace',
          }}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => togglePlay(BIRTHDAY_CONFIG.birthdaySongUrl)}
          className="btn-cyber-primary"
          style={{ padding: '8px 20px', fontSize: '0.85rem' }}
        >
          {isPlaying ? (
            <>
              <Pause size={16} fill="#05070a" />
              <span>[ PAUSE AUDIO ]</span>
            </>
          ) : (
            <>
              <Play size={16} fill="#05070a" />
              <span>[ PLAY ANTHEM ]</span>
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleMute}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isMuted ? '#ff3344' : '#00ff66' }}
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

      {isUsingSynth && (
        <div style={{ marginTop: '12px', fontSize: '0.72rem', color: '#5c7866', textAlign: 'center' }}>
          Synthesized cyber audio engine active // Replace with custom MP3 in <code>public/audio/</code> anytime
        </div>
      )}
    </div>
  );
};
