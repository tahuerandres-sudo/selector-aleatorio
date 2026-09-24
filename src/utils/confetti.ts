import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    // Left side burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 65,
      origin: { x: 0.15, y: 0.7 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      ticks: 250,
    });

    // Right side burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 65,
      origin: { x: 0.85, y: 0.7 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      ticks: 250,
    });

    // Center star burst
    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 100,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#e11d48', '#2563eb', '#16a34a', '#ca8a04', '#9333ea'],
      });
    }, 150);
  } catch {
    // If canvas or confetti fails, fail silently
  }
}
