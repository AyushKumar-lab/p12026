'use client';

import { useEffect, useState, useRef } from 'react';

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  
  return mousePosition;
}

export function CursorGlow() {
  const { x, y } = useMousePosition();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div
      className="fixed pointer-events-none z-50 mix-blend-screen"
      style={{
        left: x - 150,
        top: y - 150,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)',
        borderRadius: '50%',
        transition: 'left 0.1s ease-out, top 0.1s ease-out',
      }}
    />
  );
}
