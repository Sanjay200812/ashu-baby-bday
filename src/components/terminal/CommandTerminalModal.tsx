import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Send } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { GameProgress } from '../../types/game';
import { soundSystem } from '../../utils/audioSystem';

interface CommandTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: GameProgress;
  onNavigateArcade: () => void;
  onToggleMatrix: () => void;
  onUnlockSecretFragment: () => void;
}

interface LogEntry {
  type: 'input' | 'output' | 'system' | 'secret';
  text: string;
}

export const CommandTerminalModal: React.FC<CommandTerminalModalProps> = ({
  isOpen,
  onClose,
  progress,
  onNavigateArcade,
  onToggleMatrix,
  onUnlockSecretFragment,
}) => {
  const [command, setCommand] = useState<string>('');
  const [history, setHistory] = useState<LogEntry[]>([
    { type: 'system', text: 'SOUTH_DEV // SYSTEM_ROOT CLI v2.05' },
    { type: 'system', text: "Type 'help' for available system commands." },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;

    soundSystem.playClick();
    const newHistory: LogEntry[] = [...history, { type: 'input', text: `> ${command}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: `AVAILABLE PROTOCOLS:
  help      - Display this command index
  status    - View live system health & birthday telemetry
  profile   - Display South Dev target intelligence
  games     - Launch South Dev Cyber Arcade
  skills    - View CodeXa Agency Founder dossier & certified traits
  foodie    - Access Foodie Restaurant culinary intelligence
  secret    - Decipher hidden Aakash & Sanjay message
  matrix    - Toggle full-screen digital rain stream
  clear     - Wipe terminal output
  exit      - Terminate CLI session`,
        });
        break;

      case 'status':
        newHistory.push({
          type: 'output',
          text: `[SYSTEM DIAGNOSTICS]:
  OS: SOUTH_DEV_KERNEL // REL_2005
  CORE_STABILITY: 100% (OVERCLOCKED)
  BIRTHDAY_TARGET: ASHU [ID: 03112005]
  MODULES_CLEARED: ${
    [
      progress.flapCompleted,
      progress.gtaCompleted,
      progress.spidermanCompleted,
      progress.freefireCompleted,
      progress.foodCompleted,
      progress.sleepCompleted,
    ].filter(Boolean).length
  } / 6
  FIREWALL: INJECTED BY AAKASH & SANJAY`,
        });
        break;

      case 'profile':
        newHistory.push({
          type: 'output',
          text: `[TARGET PROFILE]:
  NAME: Ashu
  CODENAME: South Dev
  BORN: 03-Nov-2005
  SPECIALTIES: High-speed gaming, midnight coding, infinite sleep duration
  COMPRISING ALLIES: Aakash & Sanjay (Chief Syndicate Architects)`,
        });
        break;

      case 'skills':
        soundSystem.playScore();
        newHistory.push({
          type: 'output',
          text: `[CODEXA AGENCY // DOSSIER]:
  FOUNDER: Ashuuu 👑
  AGENCY: CodeXa Agency
  MOTTO: "Build. Play. Eat. Repeat."
  CREDIT: By Sanju #co-founder
  CERTIFIED SKILLS: Hacker, Pro Player, Lover Boy, Depression Guy, Developer, Food Gang, Movie Gang
  PILLARS: TECH • GAMES • MOVIES • FOOD • LIFE`,
        });
        break;

      case 'foodie':
        soundSystem.playScore();
        newHistory.push({
          type: 'output',
          text: `[FOODIE ARCHIVES]:
  7 Declassified culinary memory files recovered from Foodie.
  Access via South Dev Arcade -> Food Memories section.`,
        });
        break;

      case 'games':
        newHistory.push({ type: 'system', text: 'LAUNCHING SOUTH DEV CYBER ARCADE...' });
        soundSystem.playScore();
        setTimeout(() => {
          onNavigateArcade();
          onClose();
        }, 500);
        break;

      case 'secret':
        soundSystem.playVictory();
        onUnlockSecretFragment();
        newHistory.push({
          type: 'secret',
          text: `[ENCRYPTED TRANSMISSION DECRYPTED]:
  "Happy Birthday, South Dev!
   Aakash and Sanjay built this system breach to celebrate your legendary journey.
   No matter how chaotic the game gets, our squad wins every time.
   Enjoy your special day, brother!"`,
        });
        break;

      case 'matrix':
        soundSystem.playScore();
        newHistory.push({ type: 'output', text: 'TOGGLING MATRIX RAIN STREAM...' });
        onToggleMatrix();
        break;

      case 'clear':
        setHistory([]);
        setCommand('');
        return;

      case 'exit':
        onClose();
        return;

      default:
        newHistory.push({
          type: 'output',
          text: `ERR_UNKNOWN_CMD: '${cmd}'. Type 'help' for valid protocols.`,
        });
        break;
    }

    setHistory(newHistory);
    setCommand('');
  };

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
          height: '520px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #00ff66',
          boxShadow: '0 0 45px rgba(0, 255, 102, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Title Bar */}
        <div className="terminal-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TerminalIcon size={15} color="#00ff66" />
            <span>ROOT_TERMINAL // CLI_SESSION</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#ff3344', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Output Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            fontSize: '0.88rem',
            lineHeight: 1.6,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {history.map((item, idx) => (
            <div
              key={idx}
              style={{
                color:
                  item.type === 'input'
                    ? '#00e5ff'
                    : item.type === 'secret'
                    ? '#ffd700'
                    : item.type === 'system'
                    ? '#ff3344'
                    : '#00ff66',
                whiteSpace: 'pre-wrap',
              }}
            >
              {item.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleCommandSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'rgba(0, 255, 102, 0.05)',
            borderTop: '1px solid rgba(0, 255, 102, 0.2)',
            gap: '8px',
          }}
        >
          <span style={{ color: '#00ff66', fontWeight: 800 }}>&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type 'help', 'status', 'secret', 'matrix'..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#00ff66',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.92rem',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00ff66',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

