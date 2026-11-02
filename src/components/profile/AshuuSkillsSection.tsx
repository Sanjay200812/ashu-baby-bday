import React, { useState } from 'react';
import { ArrowLeft, Cpu, Shield, Sparkles, Terminal, Award, Zap, Code, Heart, Film, Utensils, Maximize2, X } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface AshuuSkillsSectionProps {
  onBack: () => void;
}

export const AshuuSkillsSection: React.FC<AshuuSkillsSectionProps> = ({ onBack }) => {
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);
  const profile = BIRTHDAY_CONFIG.ashuuSkillsProfile;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        padding: '24px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Top Navigation */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
        }}
      >
        <button
          onClick={() => {
            soundSystem.playClick();
            onBack();
          }}
          className="btn-cyber-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>[ RETURN TO ARCADE ]</span>
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#00e5ff',
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            padding: '6px 14px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 800,
          }}
        >
          <Cpu size={15} />
          <span>CODEXA AGENCY // DOSSIER</span>
        </div>
      </div>

      {/* Main Terminal Dossier */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '960px',
          padding: 'clamp(20px, 4vw, 36px)',
          border: '1px solid #00e5ff',
          boxShadow: '0 0 45px rgba(0, 229, 255, 0.2)',
          borderRadius: '8px',
        }}
      >
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#00ff66',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              marginBottom: '6px',
            }}
          >
            <Shield size={16} />
            <span>OPERATIONAL DOSSIER // LEVEL 21 SPEC</span>
          </div>

          <h1
            className="text-neon-cyan glitch-text"
            data-text={profile.agency}
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              marginBottom: '6px',
            }}
          >
            {profile.agency}
          </h1>

          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#00ff66',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>FOUNDER: {profile.founder}</span>
            <span>👑</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {profile.pillars.map((pillar, idx) => (
              <span
                key={idx}
                style={{
                  background: 'rgba(0, 229, 255, 0.08)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '3px',
                  fontSize: '0.72rem',
                  color: '#00e5ff',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>

        {/* Content Layout: Visual Image on left, Skills & Traits on right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          {/* Visual Profile Image */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              onClick={() => {
                soundSystem.playClick();
                setIsImageZoomed(true);
              }}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid #00e5ff',
                boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)',
                maxWidth: '380px',
                width: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src={BIRTHDAY_CONFIG.ashuuSkillsImageUrl}
                alt="Ashuu Skills Profile"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  backgroundColor: '#05070a',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/ashuu-skills.jpeg';
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #00e5ff',
                  color: '#00e5ff',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Maximize2 size={13} />
                <span>EXPAND IMAGE</span>
              </div>
            </div>

            <div style={{ marginTop: '10px', color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic' }}>
              Click image to inspect high-resolution profile
            </div>
          </div>

          {/* Official Skills List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                borderBottom: '1px solid rgba(0, 255, 102, 0.25)',
                paddingBottom: '10px',
                color: '#00ff66',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Terminal size={18} />
              <span>CONFIRMED TRAITS & SPECIALIZATIONS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {profile.skills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(8, 14, 20, 0.75)',
                    border: '1px solid rgba(0, 229, 255, 0.25)',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00ff66';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.25)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{skill.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#e2fce8', fontSize: '1rem' }}>
                        {skill.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#00e5ff' }}>
                        {skill.category}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      color: '#00ff66',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'rgba(0, 255, 102, 0.1)',
                      border: '1px solid rgba(0, 255, 102, 0.3)',
                      padding: '3px 8px',
                      borderRadius: '3px',
                    }}
                  >
                    CERTIFIED
                  </span>
                </div>
              ))}
            </div>

            {/* Motto & Credit Card */}
            <div
              style={{
                marginTop: '12px',
                background: 'rgba(255, 51, 68, 0.08)',
                border: '1px solid rgba(255, 51, 68, 0.35)',
                borderRadius: '6px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  color: '#ff3344',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  fontStyle: 'italic',
                  marginBottom: '6px',
                }}
              >
                "{profile.motto}"
              </div>
              <div style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 700 }}>
                {profile.credit}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox for Ashuu Skills Image */}
      {isImageZoomed && (
        <div
          onClick={() => setIsImageZoomed(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 4, 8, 0.94)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
            }}
          >
            <button
              onClick={() => setIsImageZoomed(false)}
              className="btn-cyber-secondary"
              style={{ color: '#ff3344', borderColor: '#ff3344' }}
            >
              <X size={16} />
              <span>[ CLOSE ]</span>
            </button>
          </div>

          <img
            src={BIRTHDAY_CONFIG.ashuuSkillsImageUrl}
            alt="Ashuu Skills Fullscreen"
            style={{
              maxHeight: '88vh',
              maxWidth: '90vw',
              objectFit: 'contain',
              borderRadius: '8px',
              border: '2px solid #00e5ff',
              boxShadow: '0 0 50px rgba(0, 229, 255, 0.4)',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/ashuu-skills.jpeg';
            }}
          />
        </div>
      )}
    </div>
  );
};
