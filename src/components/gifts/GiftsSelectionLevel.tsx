import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, CheckCircle2, ChevronRight, Sparkles, Terminal, ArrowLeft, AlertTriangle } from 'lucide-react';
import { BIRTHDAY_CONFIG, GiftItem } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface GiftsSelectionLevelProps {
  onComplete: (selectedGiftIds: string[]) => void;
  onBack?: () => void;
}

export const GiftsSelectionLevel: React.FC<GiftsSelectionLevelProps> = ({ onComplete, onBack }) => {
  // Do NOT preselect any gift
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [greedyWarning, setGreedyWarning] = useState<string | null>(null);
  const [currentRoast, setCurrentRoast] = useState<string | null>(null);

  const gifts = BIRTHDAY_CONFIG.availableGifts;

  const handleToggleGift = (gift: GiftItem) => {
    soundSystem.playClick();

    if (selectedId === gift.id) {
      // Explicitly deselect current gift
      setSelectedId(null);
      setCurrentRoast(null);
      setGreedyWarning(null);
      return;
    }

    if (selectedId !== null) {
      // Ashuu already selected one gift! Show exact funny Tenglish message
      soundSystem.playHit();
      setGreedyWarning('Aasakii hadhu, gudha kii siggu undali!');
      setTimeout(() => setGreedyWarning(null), 4500);
      return;
    }

    // Select exactly this one gift
    setSelectedId(gift.id);
    setCurrentRoast(gift.roast);
    setGreedyWarning(null);
  };

  const handleConfirm = () => {
    if (!selectedId) return;

    soundSystem.playVictory();
    confetti({
      particleCount: 160,
      spread: 90,
      colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
    });

    onComplete([selectedId]);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        fontFamily: 'var(--font-mono)',
        backgroundColor: '#050508',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onBack && (
            <button
              onClick={() => {
                soundSystem.playClick();
                onBack();
              }}
              className="btn-cyber-secondary"
              style={{ padding: '4px 10px', fontSize: '0.72rem' }}
            >
              <ArrowLeft size={12} />
              <span>BACK</span>
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff2a4b', fontSize: '0.82rem', fontWeight: 800 }}>
            <Gift size={15} />
            <span>LEVEL 7 // GIFTS VAULT (CHOOSE 1 GIFT)</span>
          </div>
        </div>

        <div
          style={{
            background: selectedId ? 'rgba(255, 183, 3, 0.15)' : 'rgba(255, 42, 75, 0.1)',
            border: `1px solid ${selectedId ? '#ffb703' : 'rgba(255, 42, 75, 0.3)'}`,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            color: selectedId ? '#ffb703' : '#9e646d',
            fontWeight: 800,
          }}
        >
          {selectedId ? '1 GIFT SELECTED' : '0 / 1 SELECTED'}
        </div>
      </div>

      {/* Main Terminal Box */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          border: '1.5px solid #ff2a4b',
          boxShadow: '0 0 50px rgba(255, 42, 75, 0.4)',
          borderRadius: '12px',
          padding: '24px 20px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 183, 3, 0.1)',
              border: '1px solid #ffb703',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#ffb703',
              marginBottom: '10px',
            }}
          >
            <Sparkles size={14} />
            <span>ASHUU'S BIRTHDAY WISHLIST</span>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
            SELECT YOUR BIRTHDAY GIFT 🎁
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.84rem' }}>
            Select exactly 1 gift. To change selection, deselect your current choice first!
          </p>
        </div>

        {/* Greedy Warning Popup / Toast */}
        {greedyWarning && (
          <div
            style={{
              background: 'rgba(255, 42, 75, 0.95)',
              border: '2px solid #ffb703',
              boxShadow: '0 0 25px rgba(255, 42, 75, 0.6)',
              borderRadius: '8px',
              padding: '14px 18px',
              marginBottom: '18px',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>
              <AlertTriangle size={18} color="#ffb703" />
              <span>Aasakii hadhu, gudha kii siggu undali!</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffb703' }}>
              Budget antha ledhu, adhi vere vishayam.
            </div>
          </div>
        )}

        {/* Gifts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {gifts.map((gift) => {
            const isSelected = selectedId === gift.id;
            return (
              <div
                key={gift.id}
                onClick={() => handleToggleGift(gift)}
                style={{
                  background: isSelected ? 'rgba(255, 42, 75, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '2px solid #ffb703' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '16px 12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 0 20px rgba(255, 183, 3, 0.4)' : 'none',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>{gift.icon}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                  {gift.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  {gift.description}
                </div>

                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      color: '#ffb703',
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Roast Reaction on Selection */}
        {currentRoast && (
          <div
            style={{
              background: 'rgba(255, 183, 3, 0.08)',
              border: '1px solid #ffb703',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffb703', fontSize: '0.78rem', fontWeight: 800, marginBottom: '4px' }}>
              <Sparkles size={14} />
              <span>GIFT ROAST:</span>
            </div>
            <div style={{ color: '#fff', fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.45 }}>
              "{currentRoast}"
            </div>
          </div>
        )}

        {/* Proceed Button */}
        <button
          onClick={handleConfirm}
          disabled={!selectedId}
          className="btn-cyber-primary pulse-cyber"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1rem',
            fontWeight: 800,
            opacity: selectedId ? 1 : 0.45,
            cursor: selectedId ? 'pointer' : 'not-allowed',
          }}
        >
          <span>
            {selectedId ? '[ LOCK GIFT & PROCEED TO VERIFICATION ➔ ]' : '[ PLEASE SELECT 1 GIFT ]'}
          </span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default GiftsSelectionLevel;
