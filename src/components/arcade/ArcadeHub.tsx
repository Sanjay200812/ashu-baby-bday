import React from 'react';
import { Sparkles, Trophy, ChevronRight, Play, CheckCircle2, Gift, Gamepad2, Film, Laugh } from 'lucide-react';
import { GameProgress, MiniGameId } from '../../types/game';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface ArcadeHubProps {
  progress: GameProgress;
  onSelectGame: (gameId: MiniGameId) => void;
  onOpenGamingQuiz: () => void;
  onOpenPersonalQuiz: () => void;
  onOpenMovieExperience: () => void;
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

export const ArcadeHub: React.FC<ArcadeHubProps> = ({
  progress,
  onSelectGame,
  onOpenGamingQuiz,
  onOpenPersonalQuiz,
  onOpenMovieExperience,
  onOpenSurprise,
}) => {
  const games: ArcadeGameMeta[] = [
    {
      id: 'flap',
      title: 'Birthday Flap',
      subtitle: "Fly through birthday candle towers with his custom hero avatar!",
      icon: '🪂',
      category: 'Arcade Classic',
      isCompleted: progress.flapCompleted,
      bestLabel: progress.flapBestScore > 0 ? `Best: ${progress.flapBestScore} pts` : undefined,
      accentColor: '#ffd700',
    },
    {
      id: 'gta',
      title: 'GTA Chaos Run',
      subtitle: 'Dodge sports cars, jump obstacles, slide under beams & collect cash',
      icon: '🚗',
      category: 'Endless Runner',
      isCompleted: progress.gtaCompleted,
      bestLabel: progress.gtaBestScore > 0 ? `Best: ${progress.gtaBestScore} pts` : undefined,
      accentColor: '#dc2626',
    },
    {
      id: 'spiderman',
      title: 'Spider Web Swing',
      subtitle: 'Hold to latch webs & swing across neon skyscrapers to the finish line',
      icon: '🕷️',
      category: '2D Platformer',
      isCompleted: progress.spidermanCompleted,
      bestLabel: progress.spidermanBestScore > 0 ? `Best: ${progress.spidermanBestScore} pts` : undefined,
      accentColor: '#00e5ff',
    },
    {
      id: 'freefire',
      title: 'Battle Royale Survival',
      subtitle: 'Stay in the shrinking blue safe zone, dodge airstrikes & grab airdrops',
      icon: '🪖',
      category: 'Combat Survival',
      isCompleted: progress.freefireCompleted,
      bestLabel: progress.freefireBestScore > 0 ? `Best: ${progress.freefireBestScore} pts` : undefined,
      accentColor: '#ea580c',
    },
    {
      id: 'food',
      title: 'Catch the Food',
      subtitle: 'Catch pizzas, burgers & biryani with funny food-eating photo reactions',
      icon: '🍕',
      category: 'Foodie Fun',
      isCompleted: progress.foodCompleted,
      bestLabel: progress.foodBestScore > 0 ? `Best: ${progress.foodBestScore} pts` : undefined,
      accentColor: '#f59e0b',
    },
    {
      id: 'sleep',
      title: 'Sleep Mode',
      subtitle: 'Fight the drowsiness meter and stay awake with sleeping photo reactions',
      icon: '😴',
      category: 'Reaction Test',
      isCompleted: progress.sleepCompleted,
      bestLabel: progress.sleepBestScore > 0 ? `Best: ${progress.sleepBestScore} pts` : undefined,
      accentColor: '#818cf8',
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
        maxWidth: '1020px',
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
            background: 'rgba(220, 38, 38, 0.18)',
            border: '1px solid rgba(220, 38, 38, 0.45)',
            borderRadius: '9999px',
            padding: '6px 18px',
            marginBottom: '16px',
          }}
        >
          <Sparkles size={16} color="#ffd700" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffd700', letterSpacing: '0.08em' }}>
            AAKASH & SANJAY'S BIRTHDAY ARCADE
          </span>
        </div>

        <h1
          className="gold-text-shimmer neon-title"
          style={{
            fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
            marginBottom: '10px',
          }}
        >
          The Birthday Arcade
        </h1>

        <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
          Play custom mini-games, test gaming trivia, and unlock the final birthday surprise for {BIRTHDAY_CONFIG.personName}!
        </p>
      </div>

      {/* Progress & Quick Action Bar */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '860px',
          padding: '20px 24px',
          marginBottom: '28px',
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
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255, 215, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy size={22} color="#ffd700" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                Arcade Progress: {completedCount} / {games.length} Games Mastered
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Play in any order, or jump straight to the final birthday card!
              </div>
            </div>
          </div>

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
            <span>FINAL BIRTHDAY SURPRISE</span>
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
              width: `${Math.max(12, progressPercent)}%`,
              background: 'linear-gradient(90deg, #ffd700 0%, #dc2626 50%, #e040fb 100%)',
              borderRadius: '9999px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Special Challenge Banners (Quizzes & Movie Challenge) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          width: '100%',
          maxWidth: '860px',
          marginBottom: '28px',
        }}
      >
        {/* Gaming Quiz Card */}
        <div
          onClick={() => {
            soundSystem.playClick();
            onOpenGamingQuiz();
          }}
          className="glass-panel"
          style={{
            padding: '18px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(20, 15, 30, 0.7) 100%)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(220, 38, 38, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
            }}
          >
            <Gamepad2 size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>Gaming Quiz</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>GTA, Spidey, Free Fire trivia</div>
          </div>
          <ChevronRight size={18} color="#ef4444" />
        </div>

        {/* Funny & Personal Quiz Card */}
        <div
          onClick={() => {
            soundSystem.playClick();
            onOpenPersonalQuiz();
          }}
          className="glass-panel"
          style={{
            padding: '18px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(224, 64, 251, 0.4)',
            background: 'linear-gradient(135deg, rgba(224, 64, 251, 0.15) 0%, rgba(20, 15, 30, 0.7) 100%)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(224, 64, 251, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e040fb',
            }}
          >
            <Laugh size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>Personal Roast Quiz</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Aakash & Sanjay's inside jokes</div>
          </div>
          <ChevronRight size={18} color="#e040fb" />
        </div>

        {/* Movie Lover Challenge Card */}
        <div
          onClick={() => {
            soundSystem.playClick();
            onOpenMovieExperience();
          }}
          className="glass-panel"
          style={{
            padding: '18px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(20, 15, 30, 0.7) 100%)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(255, 215, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffd700',
            }}
          >
            <Film size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>Movie Lover Challenge</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Guess iconic films from clues</div>
          </div>
          <ChevronRight size={18} color="#ffd700" />
        </div>
      </div>

      {/* Grid of Mini-Games */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
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
              border: game.isCompleted
                ? '1px solid rgba(74, 222, 128, 0.45)'
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
                ? 'rgba(74, 222, 128, 0.45)'
                : 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.5)';
            }}
          >
            <div>
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

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                {game.title}
              </h3>

              <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '20px' }}>
                {game.subtitle}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ fontSize: '0.82rem', color: '#ffd700', fontWeight: 600 }}>
                {game.bestLabel || 'Ready to play'}
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
