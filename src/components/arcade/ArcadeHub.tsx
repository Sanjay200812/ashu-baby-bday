import React from 'react';
import { Sparkles, Trophy, ChevronRight, Play, CheckCircle2, Gift } from 'lucide-react';
import { GameProgress, MiniGameId } from '../../types/game';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface ArcadeHubProps {
  progress: GameProgress;
  onSelectGame: (gameId: MiniGameId) => void;
  onOpenSurprise: () => void;
}

interface ArcadeGameMeta {
  id: MiniGameId;
  title: string;
  subtitle: string;
  icon: string;
  category: string;
  isCompleted: boolean;
  bestLabel?: string;
  accentColor: string;
}

export const ArcadeHub: React.FC<ArcadeHubProps> = ({ progress, onSelectGame, onOpenSurprise }) => {
  const games: ArcadeGameMeta[] = [
    {
      id: 'flap',
      title: 'Birthday Flap',
      subtitle: "Fly through birthday towers with Ashu's avatar!",
      icon: '🪂',
      category: 'Arcade Classic',
      isCompleted: progress.flapCompleted,
      bestLabel: progress.flapBestScore > 0 ? `Best: ${progress.flapBestScore} pts` : undefined,
      accentColor: '#ffd700',
    },
    {
      id: 'catch',
      title: 'Catch the Gifts',
      subtitle: 'Slide the basket to catch birthday surprises & avoid bombs',
      icon: '🎁',
      category: 'Agility',
      isCompleted: progress.catchCompleted,
      bestLabel: progress.catchBestScore > 0 ? `Best: ${progress.catchBestScore} pts` : undefined,
      accentColor: '#e040fb',
    },
    {
      id: 'memory',
      title: 'Memory Match',
      subtitle: 'Flip and match the sweet birthday pairs',
      icon: '🧠',
      category: 'Puzzle',
      isCompleted: progress.memoryCompleted,
      bestLabel: progress.memoryBestMoves > 0 ? `Best: ${progress.memoryBestMoves} moves` : undefined,
      accentColor: '#00e5ff',
    },
    {
      id: 'reaction',
      title: 'Birthday Reflexes',
      subtitle: 'Test your lightning reflexes when the cake drops',
      icon: '⚡',
      category: 'Speed Test',
      isCompleted: progress.reactionCompleted,
      bestLabel: progress.reactionBestMs > 0 ? `Best: ${progress.reactionBestMs} ms` : undefined,
      accentColor: '#ff4081',
    },
    {
      id: 'balloon',
      title: 'Balloon Pop Frenzy',
      subtitle: 'Pop floaty colorful balloons before the clock runs out',
      icon: '🎈',
      category: 'Fast Action',
      isCompleted: progress.balloonCompleted,
      bestLabel: progress.balloonBestScore > 0 ? `Best: ${progress.balloonBestScore} pts` : undefined,
      accentColor: '#4ade80',
    },
  ];

  const completedCount = games.filter((g) => g.isCompleted).length;
  const progressPercent = Math.round((completedCount / games.length) * 100);

  const handleCardClick = (id: MiniGameId) => {
    soundSystem.playClick();
    onSelectGame(id);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '36px 20px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 215, 0, 0.12)',
            border: '1px solid rgba(255, 215, 0, 0.35)',
            borderRadius: '9999px',
            padding: '6px 18px',
            marginBottom: '16px',
          }}
        >
          <Sparkles size={16} color="#ffd700" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffd700', letterSpacing: '0.08em' }}>
            BIRTHDAY ARCADE UNLOCKED
          </span>
        </div>

        <h1
          className="gold-text-shimmer neon-title"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            marginBottom: '12px',
          }}
        >
          The Birthday Arcade
        </h1>

        <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>
          Play mini-games to celebrate {BIRTHDAY_CONFIG.personName}, or unlock the secret birthday surprise whenever
          you're ready!
        </p>
      </div>

      {/* Progress & Invitation Card */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          border: '1px solid rgba(255, 215, 0, 0.35)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Progress Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 215, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy size={20} color="#ffd700" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                Arcade Progress: {completedCount} / {games.length} Games Mastered
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {completedCount === games.length
                  ? 'All mini-games conquered! You are a true champion.'
                  : 'Play any game or jump directly to the birthday reveal.'}
              </div>
            </div>
          </div>

          {/* Direct CTA to Final Surprise */}
          <button
            onClick={() => {
              soundSystem.playClick();
              onOpenSurprise();
            }}
            className="btn-primary-glow pulse-glow"
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
            }}
          >
            <Gift size={18} fill="#120d02" />
            <span>OPEN BIRTHDAY SURPRISE</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.max(10, progressPercent)}%`,
              background: 'linear-gradient(90deg, #ffd700 0%, #e040fb 100%)',
              borderRadius: '9999px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Grid of Mini-Games */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          width: '100%',
          maxWidth: '920px',
        }}
      >
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => handleCardClick(game.id)}
            className="glass-panel"
            style={{
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              position: 'relative',
              overflow: 'hidden',
              border: game.isCompleted
                ? '1px solid rgba(74, 222, 128, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.12)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = game.accentColor;
              e.currentTarget.style.boxShadow = `0 16px 36px rgba(0,0,0,0.6), 0 0 25px ${game.accentColor}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.borderColor = game.isCompleted
                ? 'rgba(74, 222, 128, 0.4)'
                : 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.5)';
            }}
          >
            <div>
              {/* Card Top: Icon & Category */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: `${game.accentColor}18`,
                    border: `1px solid ${game.accentColor}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.9rem',
                  }}
                >
                  {game.icon}
                </div>

                {/* Status Badge */}
                {game.isCompleted ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(74, 222, 128, 0.15)',
                      border: '1px solid #4ade80',
                      borderRadius: '9999px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#4ade80',
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>COMPLETED</span>
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '9999px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                    }}
                  >
                    {game.category}
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <h3
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: '8px',
                }}
              >
                {game.title}
              </h3>

              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  marginBottom: '20px',
                }}
              >
                {game.subtitle}
              </p>
            </div>

            {/* Bottom: Best score & Action */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: 600 }}>
                {game.bestLabel || 'Not played yet'}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: game.accentColor,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                <Play size={14} fill={game.accentColor} />
                <span>Play</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
