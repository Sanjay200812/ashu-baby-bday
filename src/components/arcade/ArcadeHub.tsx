import React, { useState } from 'react';
import {
  Terminal,
  Trophy,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
  Cpu,
  Activity,
  Zap,
  Code,
  Film,
  Laugh,
  Flame,
  Utensils,
  UserCheck,
  Video,
} from 'lucide-react';
import { GameProgress, MiniGameId } from '../../types/game';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface ArcadeHubProps {
  progress: GameProgress;
  onSelectGame: (gameId: MiniGameId) => void;
  onOpenGamingQuiz: () => void;
  onOpenPersonalQuiz: () => void;
  onOpenMovieExperience: () => void;
  onOpenFoodie: () => void;
  onOpenSkills: () => void;
  onOpenSurprise: () => void;
  onOpenCli: () => void;
  onOpenDashboard: () => void;
}

interface CyberGameMeta {
  id: MiniGameId;
  title: string;
  codename: string;
  subtitle: string;
  icon: string;
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
  onOpenFoodie,
  onOpenSkills,
  onOpenSurprise,
  onOpenCli,
  onOpenDashboard,
}) => {
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [easterEggToast, setEasterEggToast] = useState<string>('');

  const games: CyberGameMeta[] = [
    {
      id: 'flap',
      title: 'Birthday Flap Adventure',
      codename: 'MODULE // FLAP_PROTOCOL',
      subtitle: "Fly Ashu's avatar through cyber candle towers & digital barriers",
      icon: '🪂',
      isCompleted: progress.flapCompleted,
      bestLabel: progress.flapBestScore > 0 ? `RECORD: ${progress.flapBestScore}` : undefined,
      accentColor: '#00ff66',
    },
    {
      id: 'gta',
      title: 'GTA: Digital Escape',
      codename: 'MODULE // GTA_ESCAPE',
      subtitle: 'Dodge police vehicles, jump barriers, slide under signs & snatch cash',
      icon: '🚗',
      isCompleted: progress.gtaCompleted,
      bestLabel: progress.gtaBestScore > 0 ? `SCORE: ${progress.gtaBestScore}` : undefined,
      accentColor: '#ff3344',
    },
    {
      id: 'spiderman',
      title: 'Spider-Man: Web Protocol',
      codename: 'MODULE // WEB_SWING',
      subtitle: 'Latch web lines, swing with pendulum physics & reach the extraction zone',
      icon: '🕷️',
      isCompleted: progress.spidermanCompleted,
      bestLabel: progress.spidermanBestScore > 0 ? `SCORE: ${progress.spidermanBestScore}` : undefined,
      accentColor: '#00e5ff',
    },
    {
      id: 'freefire',
      title: 'Free Fire: Survival Protocol',
      codename: 'MODULE // BATTLE_SURVIVAL',
      subtitle: 'Hold down the arena, dodge airstrike zones & achieve BOOYAH victory',
      icon: '🪖',
      isCompleted: progress.freefireCompleted,
      bestLabel: progress.freefireBestScore > 0 ? `SCORE: ${progress.freefireBestScore}` : undefined,
      accentColor: '#ffb703',
    },
    {
      id: 'food',
      title: 'Food.exe',
      codename: 'MODULE // FOOD_FEAST',
      subtitle: "Catch falling pizzas & biryani with Ashu's funny food-eating photos",
      icon: '🍕',
      isCompleted: progress.foodCompleted,
      bestLabel: progress.foodBestScore > 0 ? `SCORE: ${progress.foodBestScore}` : undefined,
      accentColor: '#f59e0b',
    },
    {
      id: 'sleep',
      title: 'Sleep.exe',
      codename: 'MODULE // SLEEP_DEFENSE',
      subtitle: "Fight the drowsiness meter with Ashu's funny sleeping photos",
      icon: '😴',
      isCompleted: progress.sleepCompleted,
      bestLabel: progress.sleepBestScore > 0 ? `SCORE: ${progress.sleepBestScore}` : undefined,
      accentColor: '#818cf8',
    },
  ];

  const completedCount = games.filter((g) => g.isCompleted).length;
  const progressPercent = Math.round((completedCount / games.length) * 100);

  const handleCardClick = (id: MiniGameId) => {
    soundSystem.playClick();
    onSelectGame(id);
  };

  // Easter egg: Clicking South Dev header 5 times triggers a secret glitch toast!
  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    soundSystem.playClick();

    if (next === 5) {
      soundSystem.playVictory();
      setEasterEggToast('🔓 EASTER EGG UNLOCKED: "SOUTH DEV IS OVERCLOCKED TO 999GHz!"');
      setTimeout(() => setEasterEggToast(''), 4500);
      setLogoClicks(0);
    }
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
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Toast Notification */}
      {easterEggToast && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 255, 102, 0.2)',
            border: '1px solid #00ff66',
            color: '#00ff66',
            padding: '10px 20px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 800,
            zIndex: 999,
            boxShadow: '0 0 25px rgba(0, 255, 102, 0.4)',
          }}
        >
          {easterEggToast}
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div
          onClick={handleLogoClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 255, 102, 0.08)',
            border: '1px solid rgba(0, 255, 102, 0.35)',
            borderRadius: '4px',
            padding: '6px 16px',
            marginBottom: '14px',
            cursor: 'pointer',
          }}
          title="Click 5 times for a secret easter egg!"
        >
          <Cpu size={15} color="#00ff66" />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#00ff66', letterSpacing: '0.08em' }}>
            SOUTH_DEV // CYBER_ARCADE_INTERFACE v20.05
          </span>
        </div>

        <h1
          className="text-neon-green glitch-text"
          data-text="SOUTH DEV CYBER ARCADE"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900,
            letterSpacing: '0.02em',
            marginBottom: '8px',
          }}
        >
          SOUTH DEV CYBER ARCADE
        </h1>

        <p style={{ color: '#5c7866', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto' }}>
          Breached & Injected by Aakash & Sanjay // Clear security modules or trigger final override
        </p>
      </div>

      {/* Action Control Bar (CLI, Status Dashboard, Final Override) */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '880px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          border: '1px solid rgba(0, 255, 102, 0.35)',
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
          {/* Progress Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '4px',
                background: 'rgba(0, 255, 102, 0.1)',
                border: '1px solid #00ff66',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00ff66',
              }}
            >
              <Trophy size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#00ff66' }}>
                SECURITY CLEARANCE: {completedCount} / {games.length} MODULES
              </div>
              <div style={{ fontSize: '0.74rem', color: '#5c7866' }}>
                Data fragments collected: {progress.fragmentsCollected.length} / 5
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                soundSystem.playClick();
                onOpenDashboard();
              }}
              className="btn-cyber-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <Activity size={14} color="#00e5ff" />
              <span>[ TELEMETRY ]</span>
            </button>

            <button
              onClick={() => {
                soundSystem.playClick();
                onOpenCli();
              }}
              className="btn-cyber-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <Terminal size={14} color="#00ff66" />
              <span>[ CLI TERMINAL ]</span>
            </button>

            <button
              onClick={() => {
                soundSystem.playClick();
                onOpenSurprise();
              }}
              className="btn-cyber-primary pulse-cyber"
              style={{ padding: '8px 18px', fontSize: '0.84rem' }}
            >
              <Zap size={14} fill="#00ff66" />
              <span>[ FINAL SURPRISE ]</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.max(8, progressPercent)}%`,
              background: 'linear-gradient(90deg, #00ff66 0%, #00e5ff 100%)',
              boxShadow: '0 0 10px #00ff66',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Quizzes & Interrogation Banners */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px',
          width: '100%',
          maxWidth: '880px',
          marginBottom: '28px',
        }}
      >
        {/* Gaming Knowledge Database */}
        <div
          onClick={() => {
            soundSystem.playClick();
            onOpenGamingQuiz();
          }}
          className="terminal-panel"
          style={{
            padding: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid rgba(0, 255, 102, 0.35)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#00ff66';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.35)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '4px',
              background: 'rgba(0, 255, 102, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00ff66',
            }}
          >
            <Code size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#00ff66' }}>KNOWLEDGE DATABASE</div>
            <div style={{ fontSize: '0.74rem', color: '#5c7866' }}>GTA, Spider-Man, Free Fire trivia</div>
          </div>
          <ChevronRight size={16} color="#00ff66" />
        </div>

        {/* Personal Data Interrogation */}
        <div
          onClick={() => {
            soundSystem.playClick();
            onOpenPersonalQuiz();
          }}
          className="terminal-panel"
          style={{
            padding: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid rgba(255, 51, 68, 0.35)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ff3344';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 51, 68, 0.35)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '4px',
              background: 'rgba(255, 51, 68, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff3344',
            }}
          >
            <Laugh size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ff3344' }}>DATA INTERROGATION</div>
            <div style={{ fontSize: '0.74rem', color: '#5c7866' }}>Aakash & Sanjay's inside roasts</div>
          </div>
          <ChevronRight size={16} color="#ff3344" />
        </div>

        {/* Movie Knowledge Decryption */}
        <div
          onClick={() => {
            soundSystem.playClick();
            onOpenMovieExperience();
          }}
          className="terminal-panel"
          style={{
            padding: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid rgba(0, 229, 255, 0.35)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#00e5ff';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.35)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '4px',
              background: 'rgba(0, 229, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00e5ff',
            }}
          >
            <Film size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#00e5ff' }}>MOVIE DECRYPTION</div>
            <div style={{ fontSize: '0.74rem', color: '#5c7866' }}>Decipher films from emoji clues</div>
          </div>
          <ChevronRight size={16} color="#00e5ff" />
        </div>
      </div>

      {/* Grid of 6 Cyber Games */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '18px',
          width: '100%',
          maxWidth: '920px',
        }}
      >
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => handleCardClick(game.id)}
            className="terminal-panel"
            style={{
              padding: '22px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              border: game.isCompleted
                ? '1px solid #00ff66'
                : '1px solid rgba(255, 255, 255, 0.14)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = game.accentColor;
              e.currentTarget.style.boxShadow = `0 0 25px ${game.accentColor}44`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = game.isCompleted
                ? '#00ff66'
                : 'rgba(255, 255, 255, 0.14)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              {/* Card Top: Codename & Status */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#5c7866', fontWeight: 700 }}>
                  {game.codename}
                </div>

                {game.isCompleted ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#00ff66',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>CLEARED</span>
                  </div>
                ) : (
                  <div
                    style={{
                      color: '#5c7866',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                    }}
                  >
                    READY
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.6rem' }}>{game.icon}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#e2fce8' }}>
                  {game.title}
                </h3>
              </div>

              <p style={{ color: '#5c7866', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '20px' }}>
                {game.subtitle}
              </p>
            </div>

            {/* Bottom: Record & Play Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#00ff66', fontWeight: 700 }}>
                {game.bestLabel || 'NO RECORD'}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: game.accentColor,
                  fontWeight: 800,
                  fontSize: '0.82rem',
                }}
              >
                <Play size={13} fill={game.accentColor} />
                <span>EXECUTE_</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Special Intelligence & Archives Section */}
      <div style={{ width: '100%', maxWidth: '920px', marginTop: '36px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#00e5ff',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginBottom: '14px',
            borderBottom: '1px solid rgba(0, 229, 255, 0.25)',
            paddingBottom: '8px',
          }}
        >
          <Cpu size={16} />
          <span>DEEP INTELLIGENCE ARCHIVES // FOODIE & SKILLS</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {/* Food Memories Card */}
          <div
            onClick={() => {
              soundSystem.playClick();
              onOpenFoodie();
            }}
            className="terminal-panel"
            style={{
              padding: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#f59e0b';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
                fontSize: '1.4rem',
              }}
            >
              🍲
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f59e0b' }}>
                FOOD MEMORIES
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Foodie Restaurant Chronicles // 7 Photos
              </div>
            </div>
            <ChevronRight size={18} color="#f59e0b" />
          </div>

          {/* Ashuu's Skills Card */}
          <div
            onClick={() => {
              soundSystem.playClick();
              onOpenSkills();
            }}
            className="terminal-panel"
            style={{
              padding: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00e5ff';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 229, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '6px',
                background: 'rgba(0, 229, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00e5ff',
                fontSize: '1.4rem',
              }}
            >
              👑
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#00e5ff' }}>
                ASHUU'S SKILLS
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                CodeXa Agency Founder // Official Dossier
              </div>
            </div>
            <ChevronRight size={18} color="#00e5ff" />
          </div>

          {/* Special Video Reel Transmission */}
          <div
            onClick={() => {
              soundSystem.playClick();
              onOpenSurprise();
            }}
            className="terminal-panel"
            style={{
              padding: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid rgba(0, 255, 102, 0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00ff66';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 102, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '6px',
                background: 'rgba(0, 255, 102, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00ff66',
                fontSize: '1.4rem',
              }}
            >
              🎬
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#00ff66' }}>
                SPECIAL VIDEO ARCHIVE
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Birthday Surprise Reel // Full MP4 Transmission
              </div>
            </div>
            <ChevronRight size={18} color="#00ff66" />
          </div>
        </div>
      </div>
    </div>
  );
};
