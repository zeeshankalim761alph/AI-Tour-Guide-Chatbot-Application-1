import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  // We actually need to render the markdown. 
  // For simplicity in this demo to support markdown efficiently without complex parsing during typing,
  // we will just return the full text if it's already "done" or if it's too long, 
  // but for the visual flair, we might just fade it in or show it instantly.
  // Given the complexity of typing out Markdown syntax (e.g. typing `**` breaks bold until closed),
  // it is safer to just fade in the message or show it instantly for a robust React app without a heavy Markdown-stream parser.
  
  // Reverting to instant render for Markdown stability, but adding a "fade-in" class in parent.
  return <span>{text}</span>;
};