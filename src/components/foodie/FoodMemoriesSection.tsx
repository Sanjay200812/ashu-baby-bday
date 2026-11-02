import React, { useState } from 'react';
import { ArrowLeft, Utensils, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface FoodMemoriesSectionProps {
  onBack: () => void;
}

export const FoodMemoriesSection: React.FC<FoodMemoriesSectionProps> = ({ onBack }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const photos = BIRTHDAY_CONFIG.foodiePhotos;

  const handleOpenPhoto = (idx: number) => {
    soundSystem.playClick();
    setSelectedPhotoIndex(idx);
  };

  const handleCloseModal = () => {
    soundSystem.playClick();
    setSelectedPhotoIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSystem.playClick();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSystem.playClick();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    }
  };

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
      {/* Header bar */}
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
            color: '#f59e0b',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '6px 14px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 800,
          }}
        >
          <Utensils size={15} />
          <span>FOODIE PROTOCOL // {photos.length} EVIDENCE FILES</span>
        </div>
      </div>

      {/* Main Terminal Frame */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '960px',
          padding: '28px',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.15)',
          borderRadius: '8px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#f59e0b',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              marginBottom: '6px',
            }}
          >
            <span>FOOD MEMORIES REPOSITORY</span>
          </div>
          <h1
            style={{
              color: '#f59e0b',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              marginBottom: '8px',
            }}
          >
            THE FOODIE ARCHIVES
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', maxWidth: '580px', margin: '0 auto' }}>
            Photos of the food we ate at Foodie. Authentic memory fragments recovered from the system database.
          </p>
        </div>

        {/* Responsive Gallery Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >
          {photos.map((photoUrl, idx) => (
            <div
              key={idx}
              onClick={() => handleOpenPhoto(idx)}
              style={{
                position: 'relative',
                borderRadius: '6px',
                overflow: 'hidden',
                background: '#0a1017',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.6)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#f59e0b';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.6)';
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '220px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#05070a',
                }}
              >
                <img
                  src={photoUrl}
                  alt={`Food memory ${idx + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                  onError={(e) => {
                    // Fallback to placeholder if image fails
                    (e.target as HTMLImageElement).src = '/images/eating-photo.jpeg';
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#f59e0b',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Maximize2 size={12} />
                  <span>VIEW</span>
                </div>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  background: 'rgba(5, 7, 10, 0.85)',
                  borderTop: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 800 }}>
                  FOODIE // #{idx + 1}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>EVIDENCE FILE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div
          onClick={handleCloseModal}
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
          {/* Top Lightbox Controls */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              width: '90%',
              maxWidth: '800px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#f59e0b',
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>
              FOODIE PROTOCOL // #{selectedPhotoIndex + 1} OF {photos.length}
            </div>

            <button
              onClick={handleCloseModal}
              className="btn-cyber-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ff3344', borderColor: '#ff3344' }}
            >
              <X size={16} />
              <span>[ CLOSE ]</span>
            </button>
          </div>

          {/* Large Image Preview with Navigation */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '75vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={handlePrev}
              className="btn-cyber-secondary"
              style={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                padding: '12px 10px',
                borderRadius: '50%',
              }}
              title="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>

            <img
              src={photos[selectedPhotoIndex]}
              alt={`Foodie memory ${selectedPhotoIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '2px solid #f59e0b',
                boxShadow: '0 0 35px rgba(245, 158, 11, 0.35)',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/eating-photo.jpeg';
              }}
            />

            <button
              onClick={handleNext}
              className="btn-cyber-secondary"
              style={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                padding: '12px 10px',
                borderRadius: '50%',
              }}
              title="Next photo"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

