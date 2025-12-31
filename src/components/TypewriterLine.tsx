import { useState, useEffect } from 'react';

interface TypewriterLineProps {
  text: string;
  delay?: number;
}

export default function TypewriterLine({ text, delay = 0 }: TypewriterLineProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay + 30);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return <>{displayedText}</>;
}
