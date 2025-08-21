'use client';

import { useState, useEffect, useCallback } from 'react';

interface AnimatedTextProps {
  words: string[];
  colors: string[];
  className?: string;
  interval?: number;
  pauseOnHover?: boolean;
}

export function AnimatedText({ 
  words, 
  colors, 
  className = "", 
  interval = 2000,
  pauseOnHover = true
}: AnimatedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const nextWord = useCallback(() => {
    if (isPaused) return;
    
    setIsVisible(false);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
      setIsVisible(true);
    }, 300); // Half of transition duration
  }, [isPaused, words.length]);

  useEffect(() => {
    const timer = setInterval(nextWord, interval);
    return () => clearInterval(timer);
  }, [nextWord, interval]);

  const currentColor = colors[currentIndex % colors.length];

  return (
    <span 
      className={`
        inline-block transition-all duration-300 ease-in-out transform
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${className}
        ${pauseOnHover ? 'hover:scale-105' : ''}
      `}
      style={{ 
        backgroundImage: `linear-gradient(135deg, ${currentColor}, ${currentColor}dd)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        filter: isVisible ? `drop-shadow(0 0 8px ${currentColor}44)` : 'none',
        minWidth: '200px', // Prevent layout shift
        textAlign: 'center',
        lineHeight: '1.2' // Better line spacing for multi-line text
      }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      aria-label={`Cycling through languages: ${words.join(', ')}`}
      role="text"
    >
      {words[currentIndex]}
    </span>
  );
}
