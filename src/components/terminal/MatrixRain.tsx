import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  onClose?: () => void;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const characters = '0123456789ABCDEFASHUSOUTHDEV2005A&S';
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const render = () => {
      ctx.fillStyle = 'rgba(5, 7, 10, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px 'Fira Code', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // White leading head character
        if (Math.random() < 0.1) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#00ff66';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 998,
        pointerEvents: onClose ? 'auto' : 'none',
        background: 'rgba(0, 0, 0, 0.4)',
      }}
      onClick={onClose}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      {onClose && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'rgba(0, 255, 102, 0.15)',
            border: '1px solid #00ff66',
            color: '#00ff66',
            padding: '6px 14px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          [ CLICK ANYWHERE TO CLOSE MATRIX ]
        </div>
      )}
    </div>
  );
};
